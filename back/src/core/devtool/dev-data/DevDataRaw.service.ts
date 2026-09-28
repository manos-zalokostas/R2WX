import {Body, Injectable, Module} from '@nestjs/common';

const randBool = () => new Array(24).fill(1).map(() => Math.random() > 0.5)
const randFloat = () => new Array(24).fill(1).map(() => +Math.random().toFixed(3))
// const stepTime = (strdate = '2024-01-01') => new Array(24).fill(1).map((v, i) => {
//     let date = new Date(strdate);
//     return Date.parse('' + new Date(date.setHours(i)))
// })

// const stepTime = (strdate = '2024-07-01', initHour =5) =>
//     new Array(24)
//         .fill(1)
//         .map((v, i) => {
//             let date = new Date(strdate);
//             return new Date(date.setHours(initHour + ++i)).toISOString()
//         })

const stepTime = (date = new Date()) => {

    date.setSeconds(0)
    date.setMinutes(0)

    return new Array(24)
        .fill(1)
        .map((v, i) => new Date(date.setHours(date.getHours() + 1))
            .toISOString()
            .split(".")
            .shift()
            .concat("+00:00")
        )
}

@Injectable({})
export class DevDataRawService {


    /**
     *
     */
    constructor() {
    }

    mqttDataRandom(date = new Date()) {
        return JSON.stringify({
            timestamp: stepTime(date),
            value: [
                {
                    stream: "Wind_Forecast",
                    forecast: randFloat()
                },
                {
                    stream: "Thermal_Forecast",
                    forecast: randFloat()
                },
                {
                    stream: "Electric_Forecast",
                    forecast: randFloat()
                },
                {
                    stream: "PV_Forecast",
                    forecast: randFloat()
                },
                {
                    stream: "electrical_load_dsm",
                    forecast: randBool()
                },
                {
                    stream: "heat_load_dsm",
                    forecast: randBool()
                },
            ]
        })
    }

    mqttDataFixed(date = new Date) {
        return JSON.stringify({
            timestamp: stepTime(date),
            value: [
                {
                    stream: "Wind_Forecast",
                    forecast: [
                        15.0,
                        16.2,
                        17.8,
                        18.5,
                        19.1,
                        14.2,
                        16.3,
                        15.9,
                        12.5,
                        14.3,
                        15.8,
                        16.1,
                        12.9,
                        13.4,
                        14.2,
                        13.9,
                        15.1,
                        16.7,
                        17.4,
                        18.3,
                        19.2,
                        15.0,
                        16.8,
                        17.5
                    ]
                },
                {
                    stream: "Thermal_Forecast",
                    forecast: [
                        20.5,
                        21.0,
                        21.5,
                        22.0,
                        22.5,
                        23.0,
                        23.5,
                        24.0,
                        24.5,
                        25.0,
                        25.5,
                        26.0,
                        26.5,
                        27.0,
                        27.5,
                        28.0,
                        28.5,
                        29.0,
                        29.5,
                        30.0,
                        30.5,
                        31.0,
                        31.5,
                        32.0
                    ]
                },
                {
                    stream: "Electric_Forecast",
                    forecast: [
                        50.1,
                        51.2,
                        52.3,
                        53.4,
                        54.5,
                        55.6,
                        56.7,
                        57.8,
                        58.9,
                        60.0,
                        61.1,
                        62.2,
                        63.3,
                        64.4,
                        65.5,
                        66.6,
                        67.7,
                        68.8,
                        69.9,
                        71.0,
                        72.1,
                        73.2,
                        74.3,
                        75.4
                    ]
                },
                {
                    stream: "PV_Forecast",
                    forecast: [
                        5.1,
                        5.2,
                        5.3,
                        5.4,
                        5.5,
                        5.6,
                        5.7,
                        5.8,
                        5.9,
                        6.0,
                        6.1,
                        6.2,
                        6.3,
                        6.4,
                        6.5,
                        6.6,
                        6.7,
                        6.8,
                        6.9,
                        7.0,
                        7.1,
                        7.2,
                        7.3,
                        7.4
                    ]
                }
            ]
        })


    }


    mqttDataFixedOfficial() {
        return JSON.stringify({
                timestamp: [
                    "2023-09-25T01:00:00+00:00",
                    "2023-09-25T02:00:00+00:00",
                    "2023-09-25T03:00:00+00:00",
                    "2023-09-25T04:00:00+00:00",
                    "2023-09-25T05:00:00+00:00",
                    "2023-09-25T06:00:00+00:00",
                    "2023-09-25T07:00:00+00:00",
                    "2023-09-25T08:00:00+00:00",
                    "2023-09-25T09:00:00+00:00",
                    "2023-09-25T10:00:00+00:00",
                    "2023-09-25T11:00:00+00:00",
                    "2023-09-25T12:00:00+00:00",
                    "2023-09-25T13:00:00+00:00",
                    "2023-09-25T14:00:00+00:00",
                    "2023-09-25T15:00:00+00:00",
                    "2023-09-25T16:00:00+00:00",
                    "2023-09-25T17:00:00+00:00",
                    "2023-09-25T18:00:00+00:00",
                    "2023-09-25T19:00:00+00:00",
                    "2023-09-25T20:00:00+00:00",
                    "2023-09-25T21:00:00+00:00",
                    "2023-09-25T22:00:00+00:00",
                    "2023-09-25T23:00:00+00:00",
                    "2023-09-26T00:00:00+00:00"
                ],
                value: [
                    {
                        stream: "Wind_Forecast",
                        forecast: [
                            15.0,
                            16.2,
                            17.8,
                            18.5,
                            19.1,
                            14.2,
                            16.3,
                            15.9,
                            12.5,
                            14.3,
                            15.8,
                            16.1,
                            12.9,
                            13.4,
                            14.2,
                            13.9,
                            15.1,
                            16.7,
                            17.4,
                            18.3,
                            19.2,
                            15.0,
                            16.8,
                            17.5
                        ]
                    },
                    {
                        stream: "Thermal_Forecast",
                        forecast: [
                            20.5,
                            21.0,
                            21.5,
                            22.0,
                            22.5,
                            23.0,
                            23.5,
                            24.0,
                            24.5,
                            25.0,
                            25.5,
                            26.0,
                            26.5,
                            27.0,
                            27.5,
                            28.0,
                            28.5,
                            29.0,
                            29.5,
                            30.0,
                            30.5,
                            31.0,
                            31.5,
                            32.0
                        ]
                    },
                    {
                        stream: "Electric_Forecast",
                        forecast: [
                            50.1,
                            51.2,
                            52.3,
                            53.4,
                            54.5,
                            55.6,
                            56.7,
                            57.8,
                            58.9,
                            60.0,
                            61.1,
                            62.2,
                            63.3,
                            64.4,
                            65.5,
                            66.6,
                            67.7,
                            68.8,
                            69.9,
                            71.0,
                            72.1,
                            73.2,
                            74.3,
                            75.4
                        ]
                    },
                    {
                        stream: "PV_Forecast",
                        forecast: [
                            5.1,
                            5.2,
                            5.3,
                            5.4,
                            5.5,
                            5.6,
                            5.7,
                            5.8,
                            5.9,
                            6.0,
                            6.1,
                            6.2,
                            6.3,
                            6.4,
                            6.5,
                            6.6,
                            6.7,
                            6.8,
                            6.9,
                            7.0,
                            7.1,
                            7.2,
                            7.3,
                            7.4
                        ]
                    }
                ]
            }
        )


    }


}