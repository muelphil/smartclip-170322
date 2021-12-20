#include "napi-thread-safe-callback.hpp"

bool addListener(std::shared_ptr<ThreadSafeCallback> callback);
bool stopListening();

// class ClipboardChangeListener {
// 	// HWND g_hwnd;
// 	// bool g_AddedListener;
// 	// HINSTANCE hDLL;
// 	// std::set<ThreadSafeCallback*> callbacks;

// public:
//   ClipboardChangeListener(){}
//   ClipboardChangeListener(int i);
//   // int addListener(ThreadSafeCallback* callback);

// };

// #endif
