import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "postgres",
            host: "pg-771d8d-uniqlo.h.aivencloud.com",
            port: 25829,
            username: "avnadmin",
            password: "AVNS_4qD3QMRxOtVq3qjGzbx",
            database: "uniqlo_be",
            entities: [],
            autoLoadEntities: true,
            synchronize: true,
            ssl: {
                rejectUnauthorized: true,
                ca: `-----BEGIN CERTIFICATE-----
MIIEQTCCAqmgAwIBAgIUbeat4Z0U22thr0wbxXwAps42RQAwDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvZThhZmMyZDktYTJmMi00NjIwLWExNTEtNGZhY2RmMjg2
ZjM2IFByb2plY3QgQ0EwHhcNMjQwODIxMTU0MDM0WhcNMzQwODE5MTU0MDM0WjA6
MTgwNgYDVQQDDC9lOGFmYzJkOS1hMmYyLTQ2MjAtYTE1MS00ZmFjZGYyODZmMzYg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBAIkHU69k
fNl8qZkkSVUwpFsU+hV7ZeLRUF48ixxtKYOvthbQ7EtJneMAiV/7sVs6UYBO9jUz
psZJ3lRU/A+svd3449Z+XynlpRoDMcyRE42sWp76/sY6HrMxXNuvR2CLrZAUyCRt
cF/tvfKHuxwl67jJ/pVjsaaV4AYCaVEcWA+Os9OEGKQNMGxXrh7j9L5r5QQZZRi7
5p840Pm9h0rJFA9ss4Odkou1PzQcbYsd9TtjTEuA4tPBpNaUuUYTPCJ702A1qAKD
+6RJMm5sCygsZzAyDTaQ2K01ayS3QZ08WpJWdebdLgsjeGHanxc25zm9U0BbzhMo
1/MlrBnpth/3lebheDRs1q9Ww9892z+PnB8BIqxEenLZFSnBOoY1k8gmWX/S9QYR
BunZ6kMg3LVHzP0uURNr//jVigXAF0bNbfEFgh4++Owsj9ugDcdivHKKv4ZjkGEi
2n8fHQx2zMbG7RK+Hz2stQP+icxhS9c/UQuMJrG5VR2XaPqH06sDmIsqIwIDAQAB
oz8wPTAdBgNVHQ4EFgQUnDaqMuSM1rZFIVriNsb3uQUW1FYwDwYDVR0TBAgwBgEB
/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBACV+h/Olhs3pST/w
NUZS88oPPQ09I8+NxBQCWJmHZ+S2paY7b5mJe+aj627GYF617ukwvEOyfA2Fawe1
lVLKs+Vt+1p1lCEYY32X4GTP8InSbSAJgJtpKeRpu5x3qebh8zxsuS2NGwNfdbIl
OizKTWdcQ6mpwxlOxeJSxtf0NxNIVPgoi4HI46MmwcZV6TE/NjrUjbjkuVyQ8UU2
Fl3tx/aCu9C3ODXmakGjI+9gUDlkgbedN7lyX/fYEY3s9EBUq4wF+NotI3bdr/ca
ld/6eqYqDhzFR7QUFMDrH6hxKu8FlsDetphv5KBVbSn1SHUUY3FEwFJ0bmH38JnE
JOO160/+zxvPdcxysep2ozPWQq7EOTcEEQoOXRaJtpuhcXD++pdX9y6NB2pomWRZ
1w0wqN++RtcZSfyX6e1GgGcZJSJeawp+fvFwaA5A0HCXuUSsHOHjY/kBSzckJLE1
T+XLPkOvxeua1sAb/xcoBaChJUO0gyHrRKfymAvli9zHdTtjbQ==
-----END CERTIFICATE-----
`,
            },
        }),
    ],
})
export class PostgresModule {}
