// Create a type declaration file (e.g., permissions.d.ts) and include the following code:

declare global {
  interface PermissionDescriptor {
    name: 'camera' | 'microphone' | 'geolocation' | 'notifications' | 'persistent-storage' | 'push' | 'midi' | 'midi-sysex' | 'camera' | 'microphone';
  }

  // Extend the PermissionName type
  type ExtendedPermissionName = 'camera' | 'microphone';

  interface Permissions {
    query(permissionDesc: { name: ExtendedPermissionName }): Promise<PermissionStatus>;
  }
}

// This is required to make TypeScript recognize the new types
export {};
