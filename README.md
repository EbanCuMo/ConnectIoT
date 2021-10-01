# 🚧 connectiot
==================
> Proyecto realizado para el NCD Bootcamp NEAR Hispano.
# ConnectIoT es un servicio que nos permite tener acceso, por medio de la blockchain ,a diferentes dispositivos IoT y monitorearlos de acuerdo a los datos que se de van tomando con el tiempo

# ConnectIoT permite realizar las siguientes operaciones:
   1. crear nuevos dispositivos 
   2. cambiar argumentos de los dispositivos ya creados
   3. ver el tipo de dispositivo
   4. borrar dispositivos 
   5. autenticar usuarios que quieran ingresar a los dispositivos
   6. pedir permiso para entrar a un dispositivo
   7. validar el tipo de dispositivo de acuerdo a los datos que arroja
   8. ver las solicitudes de acceso

#🏁Prerrequisitos
1. node.js >=12 instalado (https://nodejs.org)
2. yarn instalado
    ```bash
    npm install --global yarn
    ```
3. instalar dependencias
    ```bash
    yarn install --frozen-lockfile
    ```
4. crear una cuenta de NEAR en [testnet](https://docs.near.org/docs/develop/basics/create-account#creating-a-testnet-account)   
5. instalar NEAR CLI
    ```bash
    yarn install --global near-cli
    ```
6. autorizar app para dar acceso a la cuenta de NEAR
    ```bash
    near login
     ```

🐑 Clonar el Repositorio
```bash
git clone https://github.com/EbanCuMo/ConnectIoT
cd ConnectIoT
```

🏗 instalar y compilar el contrato
```bash
    yarn install
    yarn build:contract:debug
```

🚀 Deployar el contrato
```bash
yarn dev:deploy:contract
```

🚂 Correr comandos
Una vez deployado el contrato, usaremos el Account Id devuelto por la operacion para ejecutar los comandos, que será el account 
Id del contrato [será utilizado como CONTRACT_ACCOUNT_ID en los ejemplos de comandos]

Utilizaremos OWNER_ACCOUNT_ID para identificar el account Id que utilizamos para ser dueños de un dispositivo.
Utilizaremos YOUR_ACCOUNT_ID para identificar el account Id que utilizamos para solicitar acceso a un dispositivo.

### Crear Dispositivo Nuevo
```bash
near call CONTRACT_ACCOUNT_ID setState '{"ownerId": "OWNER_ACCOUNT_ID","deviceId": "myOximeter","deviceType": "Oximeter","timestamp": "Thu Sep 30 2021 20:09:33 GMT-0500","args": {"bpm":75,"spo2":99}}' --accountId OWNER_ACCOUNT_ID
```

### Cambiar argumentos de un dispositivo
```bash
near call CONTRACT_ACCOUNT_ID updateState '{"deviceId":"myOximeter","deviceType": "Oximeter","timestamp": "Thu Sep 30 2021 20:09:33 GMT-0500","args": {"bpm":70,"spo2":98}}' --accountId OWNER_ACCOUNT_ID
```

### Ver arguementos de dispositivo
```bash
near call CONTRACT_ACCOUNT_ID getState '{"deviceId":"myOximeter","deviceType": "Oximeter"}' --accountId OWNER_ACCOUNT_ID
```

### Borrar un dispositivo
```bash
near call CONTRACT_ACCOUNT_ID deleteDevice'{"deviceId":"myOximeter","deviceType": "Oximeter"}' --accountId OWNER_ACCOUNT_ID
```

### Autenticar usuarios que quieren entrar al dispositivo
```bash
near call CONTRACT_ACCOUNT_ID authenticate '{"deviceId": "myOximeter","deviceType": "Oximeter","accountId": "YOUR_ACCOUNT_ID"}' --accountId OWNER_COOUNT_ID
```
### Pedir permiso para acceder a un dispositivo
```bash
near call CONTRACT_ACCOUNT_ID askForPermission '{"deviceId": "myOximeter","deviceType": "Oximeter"}' --accountId YOUR_ACCOUNT_ID
```

### Validar tipo de dispositivo de acuerdo a sus argumentos
```bash
near call CONTRACT_ACCOUNT_ID validateData '{"deviceId": "myOximeter","deviceType": "Oximeter","jsonArgs": "{bpm:70,spo2:98}"}' --accountId OWNER_ACCOUNT_ID
```
### Ver solicitudes de acceso
```bash
near call CONTRACT_ACCOUNT_ID getRequests '{"deviceId": "myOximeter","deviceType": "Oximeter"}' --accountId OWNER_ACOUNT_ID
```

# Caso de uso: ConnectIoT ayudará mucho al sector médico y a los servicios que ofrecen, ya que con este smart contract se puede acceder a los datos continuos qur toman los Smart Devices de los pacientes. Con esto los Médicos podrán saber niveles de oxigenación, temperatura, peso, hidratación, actividad fisica minima, entre muchos más. Con esto los servicios médicos podran atacar de manera más eficiente a los problemas que se enfrenten y tendran todo un registro de datos validados y reales de sus pacientes.

Los diseños de esta aplicación se pueden ver en el siguiente link: https://marvelapp.com/project/5880174