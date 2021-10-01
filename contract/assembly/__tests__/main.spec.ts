import {
  askForPermission,
  validateData,
  authenticate,
  deleteDevice,
  getRequests,
  getState,
  setState,
  updateState
} from '..';
import {
  devicesRegistry,
  healthTrackerRegistry,
  Oximeter,
  oximeterRegistry
} from '../model';
import { Context } from 'near-sdk-as';

function createOximeterDomi(): void {
  var domi = new Oximeter(
    Context.sender,
    'oximeter',
    'Oximeter',
    'Thu Sep 30 2021 20:09:33 GMT-0500',
    70,
    99);
  domi.userRequests.add('Requester');
  oximeterRegistry.set('oximeter', domi);
}

function createUnknownOximeter(): void {
  var domi = new Oximeter(
    'test',
    'oximeter',
    'Oximeter',
    'Thu Sep 30 2021 20:09:33 GMT-0500',
    70,
    99);
  oximeterRegistry.set('oximeter', domi);
}

describe('setState', () => {
  it('should create oximeter device', () => {
    var args = new Map<string, i32>();
    args.set("bpm", 77);
    args.set("spo2", 96);
    var res = setState(Context.sender, 'oximeter1', 'Oximeter', 'Thu Sep 30 2021 20:09:33 GMT-0500', args);
    var result = oximeterRegistry.getSome('oximeter1');
    expect(result.ownerId).toBe(Context.sender);
    expect(result.deviceId).toBe('oximeter1');
    expect(result.deviceType).toBe('Oximeter');
    expect(result.timestamp).toBe('Thu Sep 30 2021 20:09:33 GMT-0500');
    expect(result.bpm).toBe(77);
    expect(result.spo2).toBe(96);
    expect(res).toBe("Oximeter Registered");
  });
})

describe('getState', () => {
  it('should get oximeter device state', () => {
    createOximeterDomi();
    var result = getState('oximeter', 'Oximeter');
    expect(result).toBe('{bpm:70,spo2:99}');
  });
})

describe('askForPermission', () => {
  it('should ask for permission in oximeter device', () => {
    createUnknownOximeter();
    var resp = askForPermission('oximeter', 'Oximeter');
    expect(resp).toBe(true);
    expect(oximeterRegistry.getSome('oximeter').userRequests.has(Context.sender)).toBe(true);
  })
})

describe('getRequests', () => {
  it('should get the users that have asked for permission in oximeter device', () => {
    createOximeterDomi();
    var resp = getRequests('oximeter', 'Oximeter');
    expect(resp).toBe('Requester');
  })
})

describe('deleteDevice', () => {
  it('should delete a existing device', () => {
    createOximeterDomi();
    var resp = deleteDevice('oximeter', 'Oximeter');
    expect(resp).toBe(true);
    expect(oximeterRegistry.get('oximeter')).toBe(null);
  })
})

describe('updateState', () => {
  it('should create oximeter device', () => {
    createOximeterDomi();
    var args = new Map<string, i32>();
    args.set("bpm", 80);
    args.set("spo2", 99);
    var res = updateState('oximeter', 'Oximeter', 'Thu Sep 30 2021 20:09:33 GMT-0500', args);
    var result = oximeterRegistry.getSome('oximeter');
    expect(result.ownerId).toBe(Context.sender);
    expect(result.deviceId).toBe('oximeter');
    expect(result.deviceType).toBe('Oximeter');
    expect(result.timestamp).toBe('Thu Sep 30 2021 20:09:33 GMT-0500');
    expect(result.bpm).toBe(80);
    expect(result.spo2).toBe(99);
    expect(res).toBe("Updated");
  });
})

describe('validateData', () => {
  it('should validate the args of a device retunring its type', () => {
    createOximeterDomi();
    var resp = validateData('oximeter', 'Oximeter', '{bpm:70,spo2:99}');
    expect(resp).toBe('Oximeter');
  })
})

describe('authenticate', () => {
  it('should authenticate a user to grant access on a device', () => {
    createOximeterDomi();
    var resp = authenticate('oximeter', 'Oximeter', 'Requester');
    var oximeter = oximeterRegistry.getSome('oximeter');
    expect(resp).toBe(true);
    expect(oximeter.allowedUsers.has('Requester')).toBe(true);
    expect(oximeter.userRequests.has('Requester')).toBe(false);
  })
})