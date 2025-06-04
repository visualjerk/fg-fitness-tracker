"use client";

import { useSyncExternalStore } from "react";

type Notification = {
  title: string;
  message?: string;
};

type NotificationWithOptionalId = Notification & { id?: string };

type NotificationWithId = Notification & { id: string };

let notifications: NotificationWithId[] = [];
let listeners: (() => void)[] = [];

function showNotification({
  id,
  ...notification
}: NotificationWithOptionalId): () => void {
  const notificationWithId = { id: id ?? crypto.randomUUID(), ...notification };
  const existingNotificationIndex = notifications.findIndex(
    ({ id }) => id === notificationWithId.id
  );

  if (existingNotificationIndex > -1) {
    notifications[existingNotificationIndex] = notificationWithId;
  } else {
    notifications = [notificationWithId, ...notifications];
  }

  emitChange();

  return () => hideNotification(notificationWithId.id);
}

function hideNotification(id: string) {
  notifications = notifications.filter(
    (notification) => notification.id !== id
  );
  emitChange();
}

function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getSnapshot() {
  return notifications;
}

function useNotifications() {
  return useSyncExternalStore(subscribe, getSnapshot);
}

function emitChange() {
  listeners.forEach((listener) => listener());
}

export type { NotificationWithId, NotificationWithOptionalId };

export { showNotification, hideNotification, useNotifications };
