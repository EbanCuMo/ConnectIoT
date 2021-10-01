import { Context, logging, storage } from 'near-sdk-as';
import { Device, HealthTracker, Oximeter, devicesRegistry, oximeterRegistry, healthTrackerRegistry } from './model';

/*
* Validate a json against a device in th blockchain returning its type
*/
export function validateData(deviceId: string, deviceType: string, jsonArgs: string): string | null {
  const accountId = Context.sender;
  if (deviceType == "HealthTracker") {
    var healthTracker = healthTrackerRegistry.get(deviceId);
    if (healthTracker == null || !healthTracker.hasAccess(accountId)) {
      return null;
    }
    return jsonArgs == healthTracker.getArgs() ? healthTracker.deviceType : null;
  } else if (deviceType == "Oximeter") {
    var oximeter = oximeterRegistry.get(deviceId);
    if (oximeter == null || !oximeter.hasAccess(accountId)) {
      return null;
    }
    return jsonArgs == oximeter.getArgs() ? oximeter.deviceType : null;
  } else {
    var device = devicesRegistry.get(deviceId);
    if (device == null || !device.hasAccess(accountId)) {
      return null;
    }
    return jsonArgs == device.getArgs() ? device.deviceType : null;
  }
}

/*
* Get a device state, If the user is authorized returns the state, if not returns null
*/
export function getState(deviceId: string, deviceType: string): string | null {
  const accountId = Context.sender;
  if (deviceType == "HealthTracker") {
    var healthTracker = healthTrackerRegistry.get(deviceId);
    if (healthTracker == null || !healthTracker.hasAccess(accountId)) {
      return null;
    }
    return healthTracker.getArgs();
  } else if (deviceType == "Oximeter") {
    var oximeter = oximeterRegistry.get(deviceId);
    if (oximeter == null || !oximeter.hasAccess(accountId)) {
      return null;
    }
    return oximeter.getArgs();
  } else {
    var device = devicesRegistry.get(deviceId);
    if (device == null || !device.hasAccess(accountId)) {
      return null;
    }
    return device.getArgs();
  }
}

/*
* If the owner change the device state
*/
export function setState(
  ownerId: string,
  deviceId: string,
  deviceType: string,
  timestamp: string,
  args: Map<string, i32>): string | null {
  var isRegistered: bool = healthTrackerRegistry.contains(deviceId)
    || oximeterRegistry.contains(deviceId)
    || devicesRegistry.contains(deviceId);

  if (isRegistered) {
    return "Device already exists";
  }

  if (deviceType == "HealthTracker") {
    healthTrackerRegistry.set(deviceId, new HealthTracker(
      ownerId,
      deviceId,
      deviceType,
      timestamp,
      args.get("height"),
      args.get("weight"),
      args.get("bodyFat"),
      args.get("muscleMass")));
    return "HealthTracker Registered";
  } else if (deviceType == "Oximeter") {
    oximeterRegistry.set(deviceId, new Oximeter(
      ownerId,
      deviceId,
      deviceType,
      timestamp,
      args.get("bpm"),
      args.get("spo2")));
    return "Oximeter Registered";
  } else {
    devicesRegistry.set(deviceId, new Device(
      ownerId,
      deviceId,
      deviceType,
      timestamp));
    return "Device registered";
  }
}

/*
* If the owner update the device state
*/
export function updateState(
  deviceId: string,
  deviceType: string,
  timestamp: string,
  args: Map<string, i32>): string | null {
  const accountId = Context.sender;
  if (deviceType == "HealthTracker") {
    var healthTracker = healthTrackerRegistry.get(deviceId);
    if (healthTracker == null || healthTracker.ownerId != accountId) {
      return null;
    }
    healthTracker.timestamp = timestamp;
    healthTracker.height = args.get("height");
    healthTracker.weight = args.get("weight");
    healthTracker.bodyFat = args.get("bodyFat");
    healthTracker.muscleMass = args.get("muscleMass");
  } else if (deviceType == "Oximeter") {
    var oximeter = oximeterRegistry.get(deviceId);
    if (oximeter == null || !oximeter.hasAccess(accountId)) {
      return null;
    }
    oximeter.timestamp = timestamp;
    oximeter.bpm = args.get("bpm");
    oximeter.spo2 = args.get("spo2");
  } else {
    var device = devicesRegistry.get(deviceId);
    if (device == null || !device.hasAccess(accountId)) {
      return null;
    }
    device.timestamp = timestamp;
  }
  return "Updated";
}

/*
* An user can request authorization on a device.
*/
export function askForPermission(deviceId: string, deviceType: string): void {
  const requesterId = Context.sender;

  logging.log(
    'User: "' + requesterId + '" asking for permission to "' + deviceId + '"'
  )
  if (deviceType == "HealthTracker") {
    var healthTracker = healthTrackerRegistry.get(deviceId);
    if (healthTracker == null || healthTracker.hasAccess(requesterId)) {
      return;
    }
    healthTracker.userRequests.add(requesterId);
  } else if (deviceType == "Oximeter") {
    var oximeter = oximeterRegistry.get(deviceId);
    if (oximeter == null || oximeter.hasAccess(requesterId)) {
      return;
    }
    oximeter.userRequests.add(requesterId);
  } else {
    var device = devicesRegistry.get(deviceId);
    if (device == null || device.hasAccess(requesterId)) {
      return;
    }
    device.userRequests.add(requesterId);
  }
}

/*
* The device owner can authorise a user on a device
*/
export function authenticate(deviceId: string, deviceType: string, accountId: string): bool {
  const currentUser = Context.sender;
  if (deviceType == "HealthTracker") {
    var healthTracker = healthTrackerRegistry.get(deviceId);
    if (healthTracker == null || currentUser != healthTracker.ownerId) {
      return false;
    }
    healthTracker.allowedUsers.add(accountId);
    healthTracker.userRequests.delete(accountId);
  } else if (deviceType == "Oximeter") {
    var oximeter = oximeterRegistry.get(deviceId);
    if (oximeter == null || currentUser != oximeter.ownerId) {
      return false;
    }
    oximeter.allowedUsers.add(accountId);
    oximeter.userRequests.delete(accountId);
  } else {
    var device = devicesRegistry.get(deviceId);
    if (device == null || currentUser != device.ownerId) {
      return false;
    }
    device.allowedUsers.add(accountId);
    device.userRequests.delete(accountId);
  }
  return true;
}

/*
* Deletes a device if the owner calls it
*/
export function deleteDevice(deviceId: string, deviceType: string): bool {
  const accountId = Context.sender;
  if (deviceType == "HealthTracker") {
    var healthTracker = healthTrackerRegistry.get(deviceId);
    if (healthTracker == null || accountId != healthTracker.ownerId) {
      return false;
    }
    healthTrackerRegistry.delete(deviceId);
  } else if (deviceType == "Oximeter") {
    var oximeter = oximeterRegistry.get(deviceId);
    if (oximeter == null || accountId != oximeter.ownerId) {
      return false;
    }
    oximeterRegistry.delete(deviceId);
  } else {
    var device = devicesRegistry.get(deviceId);
    if (device == null || accountId != device.ownerId) {
      return false;
    }
    devicesRegistry.delete(deviceId);
  }
  return true;
}

/*
* Get the list of user requests on a device as string
*/
export function getRequests(deviceId: string, deviceType: string): string | null {
  const accountId = Context.sender;
  if (deviceType == "HealthTracker") {
    var healthTracker = healthTrackerRegistry.get(deviceId);
    if (healthTracker == null || accountId != healthTracker.ownerId) {
      return null;
    }
    return healthTracker.getRequests();
  } else if (deviceType == "Oximeter") {
    var oximeter = oximeterRegistry.get(deviceId);
    if (oximeter == null || accountId != oximeter.ownerId) {
      return null;
    }
    return oximeter.getRequests();
  } else {
    var device = devicesRegistry.get(deviceId);
    if (device == null || accountId != device.ownerId) {
      return null;
    }
    return device.getRequests();
  }
}