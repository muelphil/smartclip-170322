// https://www.unknowncheats.me/forum/c-and-c-/83707-setwindowshookex-example.html

// #include <Windows.h>
#include <iostream>
#include <thread>
#include "napi-thread-safe-callback.hpp"
#include <chrono>
using std::chrono::operator""ms;
// #include <winuser.h>
 
// variable to store the HANDLE to the hook. Don't declare it anywhere else then globally
// or you will get problems since every function uses this variable.
HHOOK _hook = NULL;
bool g_stopped_paste = false;
std::thread* paste_thread;
std::shared_ptr<ThreadSafeCallback> pasteCallback = NULL;
std::shared_ptr<ThreadSafeCallback> escCallback = NULL;
 
// This struct contains the data received by the hook callback. As you see in the callback function
// it contains the thing you will need: vkCode = virtual key code.
KBDLLHOOKSTRUCT kbdStruct;
 
// This is the callback function. Consider it the event that is raised when, in this case, 
// a key is pressed.
LRESULT __stdcall HookCallback(int nCode, WPARAM wParam, LPARAM lParam) {
	if (nCode >= 0) {
		// the action is valid: HC_ACTION.
		kbdStruct = *((KBDLLHOOKSTRUCT*)lParam);
		if (wParam == WM_KEYDOWN){
			if( kbdStruct.vkCode == 86/* = V */ && GetAsyncKeyState(VK_CONTROL) && !GetAsyncKeyState(VK_SHIFT)){
	            pasteCallback->call([](Napi::Env env, std::vector<napi_value>& args) {
	                // This will run in main thread and needs to construct the
	                // arguments for the call
	                args = { env.Undefined() };
	            });
			} else if(kbdStruct.vkCode == VK_ESCAPE){
		        if(escCallback != NULL){
					escCallback->call([](Napi::Env env, std::vector<napi_value>& args) {
		                // This will run in main thread and needs to construct the
		                // arguments for the call
		                args = { env.Undefined() };
		            });
				}
			}
		}
	}
 
	// call the next hook in the hook chain. This is nessecary or your hook chain will break and the hook stops
	return CallNextHookEx(_hook, nCode, wParam, lParam);
}

void SetHook() {
	// Set the hook and set it to use the callback function above
	// WH_KEYBOARD_LL means it will set a low level keyboard hook. More information about it at MSDN.
	// The last 2 parameters are NULL, 0 because the callback function is in the same thread and window as the
	// function that sets and releases the hook. If you create a hack you will not need the callback function 
	// in another place then your own code file anyway. Read more about it at MSDN.
	if (!(_hook = SetWindowsHookEx(WH_KEYBOARD_LL, HookCallback, NULL, 0))) {
		std::cerr << "Failed to install hook!!" << std::endl;
	}
}
 
int ReleaseHook() {
	const bool returnvalue = UnhookWindowsHookEx(_hook);
	_hook = NULL;
	return returnvalue;
}

int startListeningForPasteThread(){
    std::thread paste_threadd = std::thread([]{
		SetHook();
        MSG msg;
        UINT_PTR timerId = SetTimer(NULL, NULL, 10000, NULL);
		while (!g_stopped_paste && GetMessage(&msg, NULL, 0, 0)){}
		KillTimer(NULL, timerId);
    });
    paste_threadd.detach();
    paste_thread = &paste_threadd;
    return 0;
}


bool startListeningForPasteAndEscape(std::shared_ptr<ThreadSafeCallback> _pasteCallback, std::shared_ptr<ThreadSafeCallback> _escCallback){
    if(pasteCallback != NULL || _hook != NULL || NULL != paste_thread)
    	return false;
    pasteCallback = _pasteCallback;
    escCallback = _escCallback;
    g_stopped_paste = false;
    startListeningForPasteThread();
    return true;
}

bool stopListeningForPasteAndEscape(){
    // pasteCallback = NULL;
    // delete paste_thread;
    paste_thread = NULL;
	ReleaseHook();
    g_stopped_paste = true;
    escCallback = NULL;
    pasteCallback = NULL;
	return true;
}
