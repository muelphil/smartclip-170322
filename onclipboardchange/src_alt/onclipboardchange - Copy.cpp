#include <napi.h>
#include <string>
#include <set>
#include "napi-thread-safe-callback.hpp"
#include "onclipboardchange.hpp"

int listeners = 1;

// class ClipboardChangeListener {


ClipboardChangeListener::~ClipboardChangeListener(){
	if(g_hwnd != NULL) DestroyWindow(g_hwnd);
}

bool ClipboardChangeListener::addListener(ThreadSafeCallback* callback){
	callbacks.insert(callback);
	return true;
	// TODO
}

bool ClipboardChangeListener::removeListener(ThreadSafeCallback* callback){
	return callbacks.erase(callback) != 0; // erase returns how many elements were erased
}

LRESULT CALLBACK ClipboardChangeListener::s_WndProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam) {
	ClipboardChangeListener *pThis; // our "this" pointer will go here
	if (uMsg == WM_NCCREATE) {
		// Recover the "this" pointer which was passed as a parameter
		// to CreateWindow(Ex).
		LPCREATESTRUCT lpcs = reinterpret_cast<LPCREATESTRUCT>(lParam);
		pThis = static_cast<ClipboardChangeListener*>(lpcs->lpCreateParams);
		// Put the value in a safe place for future use
		SetWindowLongPtr(hwnd, GWLP_USERDATA, reinterpret_cast<LONG_PTR>(pThis));
	} else {
		// Recover the "this" pointer from where our WM_NCCREATE handler
		// stashed it.
		pThis = reinterpret_cast<ClipboardChangeListener*>(GetWindowLongPtr(hwnd, GWLP_USERDATA));
	}
	if (pThis) {
		// Now that we have recovered our "this" pointer, let the
		// member function finish the job.
		return pThis->WndProc(hwnd, uMsg, wParam, lParam);
	}
	// We don't know what our "this" pointer is, so just do the default
	// thing. Hopefully, we didn't need to customize the behavior yet.
	return DefWindowProc(hwnd, uMsg, wParam, lParam);
}

LRESULT CALLBACK ClipboardChangeListener::WndProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam) {
    switch (uMsg) {
    case WM_CREATE:
    	std::cout << "WM_CREATE" << std::endl;
        g_AddedListener = AddClipboardFormatListener(hwnd);
        if(!g_AddedListener) {
        	std::cout << "Problem3" << std::endl;
        }
        return g_AddedListener ? 0 : -1;

    case WM_DESTROY:
    	std::cout << "WM_DESTROY" << std::endl;
        if (g_AddedListener) {
            RemoveClipboardFormatListener(hwnd);
            g_AddedListener = false;
        }
        return 0;

    case 0x031D: // WM_CLIPBOARDUPDATE
    	std::cout << "WM_CLIPBOARDUPDATE" << std::endl;
        // Handle clipboard updated event
    	for (auto callback : callbacks) {
        	// Call back with result
			callback->call([](Napi::Env env, std::vector<napi_value>& args) {
			    // This will run in main thread and needs to construct the
			    // arguments for the call
			    args = { env.Undefined(), Napi::String::New(env, "hello world :)") };
			});
		}
        return 0;

    case WM_DESTROYCLIPBOARD:
    	std::cout << "WM_DESTROYCLIPBOARD" << std::endl;
        // Handle clipboard cleared event and forward message
        break;
    default:
    	std::cout << "Message of unidentified type" << std::endl;
    }

    return ::DefWindowProc(hwnd, uMsg, wParam, lParam);
} 

HRESULT ClipboardChangeListener::SetOrRefreshWindowsHook() {
    try {
        if (!g_hwnd) {
            WNDCLASS wndClass = {};
            wndClass.lpfnWndProc = s_WndProc;
            // wndClass.hInstance = g_hThisInst;
            wndClass.lpszClassName = TEXT("ClipboardChangeListener");

            if (!RegisterClass(&wndClass)) {
                DWORD dwLastError = GetLastError();
                if (dwLastError != ERROR_CLASS_ALREADY_EXISTS)
                    return HRESULT_FROM_WIN32(dwLastError);
            }

            g_hwnd = CreateWindowEx(0, wndClass.lpszClassName, "ClipboardChangeListener", 0, 0, 0, 0, 0, NULL, NULL, NULL, NULL);
            if (!g_hwnd) {
                DWORD dwLastError = GetLastError();
                std::cout << "PROBLEM!" << std::endl;
                return HRESULT_FROM_WIN32(dwLastError);
            }
        }
    } catch (...) {
        std::cout << "PROBLEM2!" << std::endl;
    }
    return S_OK;
}


ClipboardChangeListener::ClipboardChangeListener() { 
    std::cout << "Default Constructor called" << std::endl;

    // id=-1; 
}

void ClipboardChangeListener::operator()() { 
	MSG msg;
	while(GetMessage(&msg, g_hwnd, 0, 0)) {
		TranslateMessage(&msg);
		DispatchMessage(&msg);
		std::cout << "Message Received" << std::endl;
	}
}