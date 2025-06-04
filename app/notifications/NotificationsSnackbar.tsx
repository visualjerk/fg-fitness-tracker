"use client";

import * as React from "react";
import { useCallback, useEffect, useState } from "react";

import {
  hideNotification,
  NotificationWithId,
  useNotifications,
} from "./notifications";

function NotificationAlert(notification: NotificationWithId) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => {
    setOpen(false);
    setTimeout(() => {
      hideNotification(notification.id);
    }, 300);
  }, [notification.id]);

  const handleClose = (
    _event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    close();
  };

  React.useLayoutEffect(() => {
    setOpen(true);
  }, [setOpen]);

  useEffect(() => {
    setTimeout(() => {
      close();
    }, 5000);
  }, [close]);

  return (
    <div
      data-open={open ? "true" : undefined}
      className="flex gap-2 border border-teal-500 p-4 rounded-lg min-w-96 shadow-sm transition-all duration-200 translate-y-10 opacity-0 pointer-events-none data-[open=true]:translate-y-0 data-[open=true]:opacity-100 data-[open=true]:pointer-events-auto"
    >
      <div className="flex-1 grid gap-1">
        <div className="font-bold">{notification.title}</div>
        <div>{notification.message}</div>
      </div>
      <button
        type="button"
        className="shrink-0 ms-auto cursor-pointer -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
        onClick={handleClose}
      >
        <svg
          className="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </button>
    </div>
  );
}

function NotificationsSnackbar() {
  const notifications = useNotifications();

  return (
    <div className="fixed bottom-0 left-0 right-0 grid justify-center p-4 gap-2">
      {notifications.map((notification) => (
        <NotificationAlert key={notification.id} {...notification} />
      ))}
    </div>
  );
}

export { NotificationsSnackbar };
