import { PersistentSet, PersistentUnorderedMap } from "near-sdk-as";

@nearBindgen
export class Device {
    deviceId: string;
    timestamp: string;
    ownerId: string;
    deviceType: string;
    allowedUsers: PersistentSet<string>;
    userRequests: PersistentSet<string>;

    constructor(
        _ownerId: string,
        _deviceId: string,
        _deviceType: string,
        _timestamp: string) {
        this.ownerId = _ownerId;
        this.deviceId = _deviceId;
        this.timestamp = _timestamp;
        this.deviceType = _deviceType;
        this.allowedUsers = new PersistentSet<string>(this.deviceId + "A");
        this.userRequests = new PersistentSet<string>(this.deviceId + "U");
    }
    getArgs(): string {
        return "{}";
    }

    hasAccess(accountId: string): bool {
        return this.allowedUsers.has(accountId) || accountId == this.ownerId;
    }

    getRequests(): string {
        let array: Array<string> = this.userRequests.values();
        return array.join(",");
    }

    addRequest(accountId: string): void {
        this.userRequests.add(accountId);
    }
}

@nearBindgen
export class HealthTracker {
    deviceId: string;
    timestamp: string;
    ownerId: string;
    deviceType: string;
    allowedUsers: PersistentSet<string>;
    userRequests: PersistentSet<string>;
    height: i32;
    weight: i32;
    bodyFat: i32;
    muscleMass: i32;

    constructor(
        _ownerId: string,
        _deviceId: string,
        _deviceType: string,
        _timestamp: string,
        _height: i32,
        _weight: i32,
        _bodyFat: i32,
        _muscleMass: i32) {
        this.ownerId = _ownerId;
        this.deviceId = _deviceId;
        this.timestamp = _timestamp;
        this.deviceType = _deviceType;
        this.allowedUsers = new PersistentSet<string>(this.deviceId + "A");
        this.userRequests = new PersistentSet<string>(this.deviceId + "U");
        this.height = _height;
        this.weight = _weight;
        this.bodyFat = _bodyFat;
        this.muscleMass = _muscleMass;
    }

    getArgs(): string {
        return "{height:" + this.height.toString() + ",weight:"
            + this.weight.toString() + ",bodyFat:" + this.bodyFat.toString()
            + ",muscleMass:" + this.muscleMass.toString() + "}";
    }

    hasAccess(accountId: string): bool {
        return this.allowedUsers.has(accountId) || accountId == this.ownerId;
    }

    getRequests(): string {
        let array: Array<string> = this.userRequests.values();
        return array.join(",");
    }

    addRequest(accountId: string): void {
        this.userRequests.add(accountId);
    }
}

@nearBindgen
export class Oximeter {
    deviceId: string;
    timestamp: string;
    ownerId: string;
    deviceType: string;
    allowedUsers: PersistentSet<string>;
    userRequests: PersistentSet<string>;
    bpm: i32;
    spo2: i32;

    constructor(_ownerId: string,
        _deviceId: string,
        _deviceType: string,
        _timestamp: string,
        _bpm: i32,
        _spo2: i32) {
        this.ownerId = _ownerId;
        this.deviceId = _deviceId;
        this.timestamp = _timestamp;
        this.deviceType = _deviceType;
        this.allowedUsers = new PersistentSet<string>(this.deviceId + "A");
        this.userRequests = new PersistentSet<string>(this.deviceId + "U");

        this.bpm = _bpm;
        this.spo2 = _spo2;
    }

    getArgs(): string {
        return "{bpm:" + this.bpm.toString() + ",spo2:" + this.spo2.toString() + "}";
    }

    hasAccess(accountId: string): bool {
        return this.allowedUsers.has(accountId) || accountId == this.ownerId;
    }

    getRequests(): string {
        let array: Array<string> = this.userRequests.values();
        return array.join(",");
    }

    addRequest(accountId: string): void {
        this.userRequests.add(accountId);
    }
}

export let devicesRegistry = new PersistentUnorderedMap<string, Device>("d");
export let oximeterRegistry = new PersistentUnorderedMap<string, Oximeter>("o");
export let healthTrackerRegistry = new PersistentUnorderedMap<string, HealthTracker>("h");

