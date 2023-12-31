import sunImg from "./img/sun.jpg"; //太阳
import mercuryImg from "./img/mercury.jpg"; //水星
import venusImg from "./img/venus.jpg"; //金星
import earthImg from "./img/earth.jpg"; //地球
import marsImg from "./img/mars.jpg"; //火星
import jupiterImg from "./img/jupiter.jpg"; //木星
import saturnImg from "./img/saturn.jpg"; //土星
import uranusImg from "./img/uranus.jpg"; //天王星
import neptuneImg from "./img/neptune.jpg"; //海王星
import plutoImg from "./img/pluto.jpg"; //冥王星
import data from "./info.csv";
const Papa = require('papaparse');
console.log(data[0]);
let sunSize = 200, 
    mercurySize = 10*Math.log(data[1][3]),//30, 
    venusSize = 10*Math.log(data[2][3]),//45, 
    earthSize = 10*Math.log(data[3][3]),//50,
    marsSize = 10*Math.log(data[4][3]),//45, 
    jupiterSize = 10*Math.log(data[5][3]),//90,
    saturnSize = 10*Math.log(data[6][3]),//80, 
    uranusSize = 10*Math.log(data[7][3]),//70,
    neptuneSize = 10*Math.log(data[8][3]),//65, 
    plutoSize = 40;

let sun = {
    name: "Sun",//球体名称
    mapImg: sunImg,//球体贴图
    size: sunSize,//球体尺寸
    position: [0, 0, 0],//位置(x，y，z)
    rotation: 0.05,//自转速度
    revolution: 0,//公转速度
    data: {
        sunDistance: "0km", weight: "1.989e30kg", diameter: "1392000km", rotation: "36day",
        revolution: "", temp: "5500℃"
    }//描述
};

let mercury = {
    name: data[1][0],
    mapImg: mercuryImg,
    size: mercurySize,
    position: [sunSize+mercurySize+10*Math.log((10**6)*data[1][9]),//sunSize + mercurySize + 25, 
        0, 
        0],
    rotation: 0.001,
    revolution: 0.02,
    data: {
        sunDistance: data[1][9], weight: data[1][2], diameter: data[1][3], rotation: data[1][7],
        revolution: data[1][12], temp: data[1][17], centrip: "1.28e+22", grav: "1.31e+22"
    }
};
let venus = {
    name: data[2][0],
    mapImg: venusImg,
    size: venusSize,
    position: [mercury.position[0] + mercurySize + venusSize + 10*Math.log(10**6*data[2][9])- 10*Math.log((10**6)*data[1][9]),
    //mercury.position[0] + mercurySize + venusSize + 25, 
    0, 
    0],
    rotation: 0.00025,
    revolution: -0.016, //金星公转方向特殊
    data: {
        sunDistance: data[2][9], weight: data[2][2], diameter: data[2][3], rotation: data[2][7],
        revolution: data[2][12], temp: data[2][17], centrip: "5.51e+22", grav: "5.55e+22"
    }

};
let earth = {
    name: data[3][0],
    mapImg: earthImg,
    size: earthSize,
    position: [venus.position[0] + venusSize + earthSize + 10*Math.log(10**6*data[3][9]) - 10*Math.log(10**6*data[2][9]), //venus.position[0] + venusSize + earthSize + 100, 
    0, 
    0],
    rotation: 0.05,
    revolution: 0.01,
    data: {
        sunDistance: data[3][9], weight: data[3][2], diameter: data[3][3], rotation: data[3][7],
        revolution: data[3][12], temp: data[3][17], centrip: "3.54e+22", grav: "3.56e+22"
    }

};
let mars = {
    name: data[4][0],
    mapImg: marsImg,
    size: marsSize,
    position: [earth.position[0] + earthSize + marsSize + 10*Math.log(10**6*data[4][9]) - 10*Math.log(10**6*data[3][9]),//earth.position[0] + earthSize + marsSize + 100, 
    0, 
    0],
    rotation: 0.05,
    revolution: 0.005,
    data: {
        sunDistance: data[4][9], weight: data[4][2], diameter: data[4][3], rotation: data[4][7],
        revolution: data[4][12], temp: data[4][17], centrip: "1.635e+21", grav: "1.647+21"
    }

};
let jupiter = {
    name: data[5][0],
    mapImg: jupiterImg,
    size: jupiterSize,
    position: [mars.position[0] + marsSize + jupiterSize + 10*Math.log(10**6*data[5][9]) - 10*Math.log(10**6*data[4][9]), 
    0, 
    0],
    rotation: 0.14,
    revolution: 0.003,
    data: {
        sunDistance: data[4][9], weight: data[4][2], diameter: data[4][3], rotation: data[4][7],
        revolution: data[4][12], temp: data[4][17], centrip: "4.18e+23", grav: "4.18e+23"
    }

};
let saturn = {
    name: data[6][0],
    mapImg: saturnImg,
    size: saturnSize,
    position: [jupiter.position[0] + jupiterSize + saturnSize + 10*Math.log(10**6*data[6][9]) - 10*Math.log(10**6*data[5][9]), 
    0, 
    0],
    rotation: 0.13,
    revolution: 0.0015,
    data: {
        sunDistance: data[4][9], weight: data[4][2], diameter: data[4][3], rotation: data[4][7],
        revolution: data[4][12], temp: data[4][17], centrip: "3.73e+22", grav: "3.69e+22"
    }

};
let uranus = {
    name: data[7][0],
    mapImg: uranusImg,
    size: uranusSize,
    position: [saturn.position[0] + saturnSize + uranusSize + 10*Math.log(10**6*data[7][9]) - 10*Math.log(10**6*data[6][9]), 
    0, 
    0],
    rotation: 0.11,
    revolution: 0.0012,
    data: {
        sunDistance: data[5][9], weight: data[5][2], diameter: data[5][3], rotation: data[5][7],
        revolution: data[5][12], temp: data[5][17], centrip: "1.40e+21", grav: "1.41e+21"
    }

};
let neptune = {
    name: data[8][0],
    mapImg: neptuneImg,
    size: neptuneSize,
    position: [uranus.position[0] + uranusSize + neptuneSize + 10*Math.log(10**6*data[8][9]) - 10*Math.log(10**6*data[7][9]), 
    0, 
    0],
    rotation: 0.12,
    revolution: 0.0011,
    data: {
        sunDistance: data[6][9], weight: data[6][2], diameter: data[6][3], rotation: data[6][7],
        revolution: data[6][12], temp: data[6][17], centrip: "6.59e+20", grav: "6.67e+20"
    }

};
// let pluto = {
//     name: "Pluto",
//     mapImg: plutoImg,
//     size: plutoSize,
//     position: [neptune.position[0] + neptuneSize + plutoSize + 25, 0, 0],
//     rotation: 0.11,
//     revolution: 0.001,
//     data: {
//         sunDistance: "59.13e8km", weight: "1.27e22kg", diameter: "2274km", rotation: "6.387day",
//         revolution: "1248year", temp: "-240℃"
//     }

// };
let planetList = [sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune
//    , pluto
];
export default planetList;