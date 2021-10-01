import { Context, logging, storage } from 'near-sdk-as';
import { Device, HealthTracker, Oximeter } from './model';

/*
* Validate a json against a device in th blockchain returning its type
*/
export function validateData(deviceId: string, jsonArgs: string): string | null {
  const accountId = Context.sender;
  var targetDevice = storage.get<Device>(deviceId);

  if (targetDevice == null) {
    return null;
  }

  var isAllowed: bool = targetDevice.allowedUsers.has(accountId) ||
    accountId == targetDevice.ownerId;

  if (!isAllowed) {
    return null;
  }

  return jsonArgs == targetDevice.getArgs() ? targetDevice.deviceType : null;
}

/*
* Get a device state, If the user is authorized returns the state, if not returns null
*/
export function getState(deviceId: string): string | null {
  const accountId = Context.sender;
  var targetDevice = storage.get<Device>(deviceId);

  if (targetDevice == null) {
    return "Device not found";
  }

  if (!targetDevice.allowedUsers) {
    return "not alllowed users";
  }
  if (!targetDevice.ownerId) {
    return "not ownerId";
  }

  var isAllowed: bool = targetDevice.allowedUsers.has(accountId) ||
    accountId == targetDevice.ownerId;

  if (!isAllowed) {
    return "Unauthorized";
  }

  if (targetDevice.deviceType == "Oximeter") {
    var oximeter = storage.get<Oximeter>(deviceId);
    if (oximeter != null) {
      return oximeter.getArgs();
    }
  } else if (targetDevice.deviceType == "HealthTracker") {
    var healthTracker = storage.get<HealthTracker>(deviceId);
    if (healthTracker != null) {
      return healthTracker.getArgs();
    }
  }
  return targetDevice.getArgs();
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
  var targetDevice = storage.get<Device>(deviceId);
  if (targetDevice != null) {
    return "Device already exists";
  }

  if (deviceType == "HealthTracker") {
    storage.set(deviceId, new HealthTracker(
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
    storage.set(deviceId, new Oximeter(
      ownerId,
      deviceId,
      deviceType,
      timestamp,
      args.get("bpm"),
      args.get("spo2")));
    return "Oximeter Registered";
  } else {
    storage.set(deviceId, new Device(
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
  timestamp: string,
  args: Map<string, i32>): string | null {
  const accountId = Context.sender;
  var targetDevice = storage.get<Device>(deviceId);

  if (targetDevice == null) {
    return "Device not found";
  }

  if (accountId != targetDevice.ownerId) {
    return "Unauthorized: " + "-" + accountId;
  }

  targetDevice.timestamp = timestamp;
  if (targetDevice.deviceType == "Oximeter") {
    var oximeter = storage.get<Oximeter>(deviceId);
    if (oximeter == null) {
      return "Type Error";
    }
    oximeter.bpm = args.get("bpm");
    oximeter.spo2 = args.get("spo2");
  } else if (targetDevice.deviceType == "HealthTracker") {
    var healthTracker = storage.get<HealthTracker>(deviceId);
    if (healthTracker == null) {
      return "Type Error";
    }
    healthTracker.height = args.get("height");
    healthTracker.weight = args.get("weight");
    healthTracker.bodyFat = args.get("bodyFat");
    healthTracker.muscleMass = args.get("muscleMass");

  }
  return "Updated";
}

/*
* An user can request authorization on a device.
*/
export function askForPermission(deviceId: string): void {
  const requesterId = Context.sender;

  logging.log(
    'User: "' + requesterId + '" asking for permission to "' + deviceId + '"'
  )

  var targetDevice = storage.get<Device>(deviceId);
  if (targetDevice == null) {
    return;
  }

  targetDevice.userRequests.add(requesterId);
}

/*
* The device owner can authorise a user on a device
*/
export function authenticate(deviceId: string, accountId: string): bool {
  var targetDevice = storage.get<Device>(deviceId);
  const currentUser = Context.sender;

  if (targetDevice == null || currentUser != targetDevice.ownerId) {
    return false;
  }

  if (!targetDevice.userRequests.has(accountId)) {
    return false;
  }

  targetDevice.allowedUsers.add(accountId);
  targetDevice.userRequests.delete(accountId);
  return true;
}

/*
* Deletes a device if the owner calls it
*/
export function deleteDevice(deviceId: string): bool {
  const accountId = Context.sender;
  var targetDevice = storage.get<Device>(deviceId);

  /*if (targetDevice == null) {
    return false;
  }*/

  /*if (accountId != targetDevice.ownerId) {
    return false;
  }*/

  storage.delete(deviceId);

  return true;
}