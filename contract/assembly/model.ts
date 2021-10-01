import { PersistentSet } from "near-sdk-as";

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
        this.allowedUsers = new PersistentSet<string>("a");
        this.userRequests = new PersistentSet<string>("r");
    }
    getArgs(): string {
        return "{}";
    }
}

@nearBindgen
export class HealthTracker extends Device {
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
        super(_ownerId,
            _deviceId,
            _deviceType,
            _timestamp);
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
}

@nearBindgen
export class Oximeter extends Device {
    bpm: i32;
    spo2: i32;

    constructor(_ownerId: string,
        _deviceId: string,
        _deviceType: string,
        _timestamp: string,
        _bpm: i32,
        _spo2: i32) {
        super(_ownerId,
            _deviceId,
            _deviceType,
            _timestamp);

        this.bpm = _bpm;
        this.spo2 = _spo2;
    }

    getArgs(): string {
        return "{bpm:" + this.bpm.toString() + ",spo2:" + this.spo2.toString() + "}";
    }
}