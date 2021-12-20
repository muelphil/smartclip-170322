// #include <napi.h>
#include <string>
#include <set>
// #include <windows.h> // this is already included with napi-thread-safe-callback.hpp
#include <iostream>
#include <napi.h>
#include "napi-thread-safe-callback.hpp"
// #include "onclipboardchange.h"



// typedef BOOL (CALLBACK* ADDCLIPBOARDFORMATLISTENER)(HWND);
// typedef BOOL (CALLBACK* REMOVECLIPBOARDFORMATLISTENER)(HWND);
// ADDCLIPBOARDFORMATLISTENER AddClipboardFormatListener;
// REMOVECLIPBOARDFORMATLISTENER RemoveClipboardFormatListener;

// HINSTANCE g_hThisInst = NULL;

HWND g_hwnd = NULL;
bool g_AddedListener = false;
HINSTANCE hDLL = NULL;
bool initizalized = false;
std::set<std::shared_ptr<ThreadSafeCallback>> callbacks;

bool addListener(std::shared_ptr<ThreadSafeCallback> callback){
	callbacks.insert(callback);
	return true;
	// TODO
}

bool removeListener(std::shared_ptr<ThreadSafeCallback> callback){
	return callbacks.erase(callback) != 0; // erase returns how many elements were erased
}

LRESULT CALLBACK WndProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam) {
	
    switch (uMsg) {
    case WM_CREATE:
    	std::cout << "WM_CREATE" << std::endl;
        g_AddedListener = AddClipboardFormatListener(hwnd);
        if(!g_AddedListener){
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

    case 0x031D: //WM_CLIPBOARDUPDATE
    	std::cout << "WM_CLIPBOARDUPDATE" << std::endl;
  //   	for (auto callback : callbacks) {
	 //        // Call back with result
	 //        callback->call([](Napi::Env env, std::vector<napi_value>& args) {
	 //            // This will run in main thread and needs to construct the
	 //            // arguments for the call
	 //            args = { env.Undefined(), Napi::String::New(env, 'hello world :)') };
	 //        });
		// }
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

            g_hwnd = CreateWindowEx(
            	0, wndClass.lpszClassName, "ClipboardChangeListener", 0, 0, 0, 0, 0, NULL, NULL, NULL, NULL);
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



Napi::Boolean addClipboardChangeListener(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();
	if(!initizalized){
		try{
			// hDLL = LoadLibrary("user32.dll");
			// AddClipboardFormatListener = (ADDCLIPBOARDFORMATLISTENER)GetProcAddress(hDLL, "AddClipboardFormatListener");
			// RemoveClipboardFormatListener = (REMOVECLIPBOARDFORMATLISTENER)GetProcAddress(hDLL, "RemoveClipboardFormatListener");
			initizalized = true;
		} catch(...){
			// return false
			FreeLibrary(hDLL);
			DestroyWindow(g_hwnd);
			return Napi::Boolean::New(env, false);
		}
	}
	if(!g_hwnd){
		SetOrRefreshWindowsHook();
	    // Pass callback to other thread
	    std::thread([] {
	        try {
				MSG msg;
				while(GetMessage(&msg, g_hwnd, 0, 0)) {
					TranslateMessage(&msg);
					DispatchMessage(&msg);
					std::cout << "Message Received" << std::endl;
				}
		        // // Call back with result
		        // callback->call([result](Napi::Env env, std::vector<napi_value>& args) {
		        //     // This will run in main thread and needs to construct the
		        //     // arguments for the call
		        //     args = { env.Undefined(), Napi::String::New(env, result) };
		        // });
	        } catch (...){ // TODO std::exception& e) { 
	            // Call back with error
	            // callback->callError(e.what());
	            // TODO
	        }
	    }).detach();
	}
	    // Capture callback in main thread
	Napi::Function callback = info[0].As<Napi::Function>();
    auto callbackPtr = std::make_shared<ThreadSafeCallback>();
   	addListener(callbackPtr);
   	return Napi::Boolean::New(env, true); // TODO
}



Napi::String helloWorld(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();
	return Napi::String::New(env, "Hello World!");
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
	exports.Set(
		Napi::String::New(env, "helloWorld"),
		Napi::Function::New(env, helloWorld)
	);
	return exports;
}

NODE_API_MODULE(onclipboardchange, Init)
