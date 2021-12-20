#include <napi.h>
#include <string>
#include <set>
#include "napi-thread-safe-callback.hpp"
#include "onclipboardchange.hpp"

std::set<std::shared_ptr<ThreadSafeCallback>> callbacks;
bool g_AddedListener = false;
HWND g_hwnd = NULL;
std::thread* g_thread = NULL;
bool g_stopped = false;

static LRESULT CALLBACK WndProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam) {
	std::cout << "WndProc called!" << std::endl;
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
    	std::cout << "WM_DESTROYCLIPBOARD" << std::endl; // TODO when does this happen? cut and paste ?
        // Handle clipboard cleared event and forward message
        break;
    }

    return ::DefWindowProc(hwnd, uMsg, wParam, lParam);
} 

static HRESULT SetOrRefreshWindowsHook() {
    try {
        if (!g_hwnd) {
            WNDCLASS wndClass = {};
            wndClass.lpfnWndProc = &WndProc;
            // wndClass.hInstance = g_hThisInst;
            wndClass.lpszClassName = TEXT("SomeWindowverylongverylongverylongverylongverylong");

            if (!RegisterClass(&wndClass)) {
                DWORD dwLastError = GetLastError();
                if (dwLastError != ERROR_CLASS_ALREADY_EXISTS)
                    return HRESULT_FROM_WIN32(dwLastError); // TODO
            }

            g_hwnd = CreateWindowEx(0, wndClass.lpszClassName, "verylongverylongverylongverylongverylongClipboardChangeListener", 0, 0, 0, 0, 0, NULL, NULL, NULL, NULL);
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

void run() {
	g_stopped = false;
	std::thread([]{
		MSG msg;
		if(g_hwnd == NULL){
			std::cout << "g_hwnd undefined" << std::endl;
		} else {
			std::cout << "g_hwnd defined" << std::endl;
		}
		while(GetMessage(&msg, g_hwnd, 0, 0)) {
			TranslateMessage(&msg);
			DispatchMessage(&msg);
			std::cout << "Message Received" << std::endl;
		}
	}).detach();
}

void stop(){
	g_stopped = true;
}

bool addListener(std::shared_ptr<ThreadSafeCallback> callback){
	if(!g_hwnd){
		std::cout << "starting thread" << std::endl;
		SetOrRefreshWindowsHook();
		run();
	}
	callbacks.insert(callback);
	return true;
}

bool stopListening(){
	// callbacks.clear();
	// DestroyWindow(g_hwnd);
	// stop();
}