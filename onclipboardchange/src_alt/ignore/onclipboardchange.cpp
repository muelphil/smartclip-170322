#include <napi.h>
#include <string>
#include <Windows.h>
// #include "onclipboardchange.h"

const int WM_CLIPBOARDUPDATE = 0x031D;

class ClipboardChangeListener {

	typedef BOOL (CALLBACK* ADDCLIPBOARDFORMATLISTENER)(HWND);
	typedef BOOL (CALLBACK* REMOVECLIPBOARDFORMATLISTENER)(HWND);
	ADDCLIPBOARDFORMATLISTENER AddClipboardFormatListener;
	REMOVECLIPBOARDFORMATLISTENER RemoveClipboardFormatListener;
	std::set<ThreadSafeCallback*> callbacks;
	// HINSTANCE g_hThisInst = NULL;
	HWND g_hwnd = NULL;
	bool g_AddedListener = false;
	HINSTANCE hDLL = NULL;

public: 
    void operator()() { 
		try{
			hDLL = LoadLibrary("user32.dll");
			AddClipboardFormatListener = (ADDCLIPBOARDFORMATLISTENER)GetProcAddress(hDLL, "AddClipboardFormatListener");
			RemoveClipboardFormatListener = (REMOVECLIPBOARDFORMATLISTENER)GetProcAddress(hDLL, "RemoveClipboardFormatListener");
			initizalized = true;
		} catch(...){
			std::terminate()
		}
		MSG msg;
		while(GetMessage(&msg, g_hwnd, 0, 0)) {
			TranslateMessage(&msg);
			DispatchMessage(&msg);
			std::cout << "Message Received" << std::endl;
		}
    }

    void ~ClipboardChangeListener(){
		if(hDLL != NULL) FreeLibrary(hDLL);
		if(g_hwnd != NULL) DestroyWindow(g_hwnd);
    }

    bool addListener(ThreadSafeCallback* callback){
    	callbacks.insert(callback);
    	return true;
    	// TODO
    }

    bool removeListener(ThreadSafeCallback* callback){
    	return callbacks.erase(callback) != 0; // erase returns how many elements were erased
    }
private:
	static LRESULT CALLBACK WndProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam) {
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

	    case WM_CLIPBOARDUPDATE:
	    	std::cout << "WM_CLIPBOARDUPDATE" << std::endl;
	        // Handle clipboard updated event
        	for (auto callback : callbacks) {
	        	// Call back with result
				callback->call([](Napi::Env env, std::vector<napi_value>& args) {
				    // This will run in main thread and needs to construct the
				    // arguments for the call
				    args = { env.Undefined(), Napi::String::New(env, 'hello world :)') };
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

	static HRESULT SetOrRefreshWindowsHook() {
	    try {
	        if (!g_hwnd) {
	            WNDCLASS wndClass = {};
	            wndClass.lpfnWndProc = &WndProc;
	            // wndClass.hInstance = g_hThisInst;
	            wndClass.lpszClassName = TEXT("SmartClipListener");

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
}