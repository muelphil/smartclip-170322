#include <iostream>
#include <thread>
#include "napi-thread-safe-callback.hpp"
// #include <winuser.h>
#include <dwmapi.h>

// https://devblogs.microsoft.com/oldnewthing/20121003-00/?p=6423
bool DisableDwmAnimations(HWND hwnd) {
    BOOL fDisable = TRUE;
    HRESULT res = DwmSetWindowAttribute(hwnd,
    	DWMWA_TRANSITIONS_FORCEDISABLED,
    	&fDisable,
    	sizeof(fDisable));
    return res == S_OK;
}