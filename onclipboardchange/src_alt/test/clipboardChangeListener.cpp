#include <iostream>
#include <Windows.h>
#include <winuser.h>

// https://docs.microsoft.com/de-de/windows/win32/dataxchg/clipboard?redirectedfrom=MSDN

const int WM_CLIPBOARDUPDATE = 0x031D;
// This is not usable, because setting this as parent window will result into messages not instantly propagating
// const HWND HWND_MESSAGE = ((HWND)-3);

typedef BOOL (CALLBACK* ADDCLIPBOARDFORMATLISTENER)(HWND);
typedef BOOL (CALLBACK* REMOVECLIPBOARDFORMATLISTENER)(HWND);
ADDCLIPBOARDFORMATLISTENER AddClipboardFormatListener;
REMOVECLIPBOARDFORMATLISTENER RemoveClipboardFormatListener;

HINSTANCE g_hThisInst = NULL;
HWND g_hwnd = NULL;
bool g_AddedListener = false;

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

    case WM_CLIPBOARDUPDATE:
    	std::cout << "WM_CLIPBOARDUPDATE" << std::endl;
        // Handle clipboard updated event
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


int main(){
	HINSTANCE hDLL = LoadLibrary("user32.dll");

	if (hDLL != NULL) {
	   AddClipboardFormatListener = (ADDCLIPBOARDFORMATLISTENER)GetProcAddress(hDLL, "AddClipboardFormatListener");
	   RemoveClipboardFormatListener = (REMOVECLIPBOARDFORMATLISTENER)GetProcAddress(hDLL, "RemoveClipboardFormatListener");
	   if (!AddClipboardFormatListener || !RemoveClipboardFormatListener) {
	      // handle the error
	      FreeLibrary(hDLL);
	   } else {
			SetOrRefreshWindowsHook();
	   }
	}
	
	MSG msg;
	while(GetMessage(&msg, g_hwnd, 0, 0)) {
		TranslateMessage(&msg);
		DispatchMessage(&msg);
		std::cout << "Message Received" << std::endl;
	}
	DestroyWindow(g_hwnd);

	return 0;
}
