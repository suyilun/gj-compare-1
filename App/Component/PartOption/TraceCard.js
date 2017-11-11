const barCard = (trace, traceStyle) => {
    return (
        <div key={trace.hbaseKey} className={traceStyle}>
            <h1>{trace.barName}</h1>
            <ul>
                <li><span>姓名:</span><span>{trace.name}</span></li>
                <li><span>{trace.onTime}</span></li>
                <li><span>{trace.offTime}</span></li>
            </ul>
            <img src={require(`../../images/life_class/${trace.catg}_life_big.png`)}></img>
        </div>
    );
}

const hotelCard = (trace, traceStyle) => {
    return (
        <div key={trace.hbaseKey} className={traceStyle}>
            <h1 title={trace.address}>{trace.hotelName}</h1>
            <ul>
                <li><span>房号:</span><span>{trace.roomNo}</span></li>
                <li><span>{trace.inTime}</span></li>
                <li><span>{trace.outTime}</span></li>
            </ul>
            <img src={require(`../../images/life_class/${trace.catg}_life_big.png`)}></img>
        </div>
    );
}

const trainCard = (trace, traceStyle) => {
    return (
        <div key={trace.hbaseKey} className={traceStyle}>
            <h1>{trace.trainCode}</h1>
            <ul>
                <li><span>姓名:</span><span>{trace.name}</span></li>
                <li><span>车次:</span><span>{trace.trainDate}</span></li>
                <li style={{ fontWeight: 'border' }}><span >{trace.departure}</span><span> - </span><span>{trace.terminal}</span></li>
            </ul>
            <img src={require(`../../images/life_class/${trace.catg}_life_big.png`)}></img>
        </div>
    );
}

// const hcDpCard = (trace) => {
//   return (
//     <div className={cardClassName}>
//       <h1>{trace.cc}</h1>
//       <ul>
//         <li><span>姓名:</span><span>{trace.ckxm}</span></li>
//         <li><span>{trace.send_time}</span></li>
//         <li><span>{trace.cfz}</span><span> - </span><span>{trace.ddz}</span></li>
//       </ul>
//       <img src={`images/life_class/${trace.catg}_life_big.png`}></img>
//     </div>
//   );
// }

// const hcJzCard = (trace) => {
//   return (
//     <div className={cardClassName}>
//       <h1>{trace.train_code}</h1>
//       <ul>
//         <li><span>座位:</span><span>{trace.seat_no}</span></li>
//         <li><span>{trace.send_time}</span></li>
//         <li><span>{trace.to_telecode_mc}</span><span> - </span><span>{trace.from_telecode_mc}</span></li>
//       </ul>
//       <img src={`images/life_class/${trace.catg}_life_big.png`}></img>
//     </div>
//   )
// }

const busCard = (trace, traceStyle) => {
    return (
        <div key={trace.hbaseKey} className={traceStyle}>
            <h1>{trace.terminal}</h1>
            <ul>
                <li><span>姓名:</span><span>{trace.name}</span></li>
                <li><span>买票:</span><span>{trace.sellTime}</span></li>
                <li><span>{trace.lineName}</span></li>
            </ul>
            <img src={require(`../../images/life_class/${trace.catg}_life_big.png`)}></img>
        </div>
    );
}

const flightCard = (trace, traceStyle) => {
    const liArr = [];
    liArr.push(<li>{trace.seatNo ? (<span>座位:{trace.seatNo}</span>) : null}</li>);
    if (trace.takeOffStation || trace.terminalStation) {
        liArr.push(<li><span style={{ fontWeight: 'border' }}>{trace.takeOffStation}-{trace.terminalStation}</span></li>);
    }
    if (trace.takeOffDay || trace.arriveDay) {
        liArr.push(<li><span>出发:{trace.takeOffDay}</span></li>);
        liArr.push(<li><span>到达:{trace.arriveDay}</span></li>);
    } else {
        liArr.push(<li><span>离港:{trace.takeOffDayTime}</span></li>);
        liArr.push(<li><span>进港:{trace.arriveDayTime}</span></li>);
    }


    return (
        <div key={trace.hbaseKey} className={traceStyle}>
            <h1>{trace.airlineCode ? `${trace.airlineCode}${trace.flightNo}` : `${trace.flightNo}`}</h1>
            <ul>
                {liArr}
            </ul>
            <img src={require(`../../images/life_class/${trace.catg}_life_big.png`)}></img>
        </div>
    );
}

// const fjDzCard = (trace) => {
//   return (
//     <div className={cardClassName}>
//       <h1>{trace.hbh}</h1>
//       <ul>
//         <li><span>{trace.seg_dept_code_zhwz}</span><span>-</span><span>{trace.seg_dest_code_zhwz}</span></li>
//         <li><span>出发:</span><span>{trace.air_seg_dpt_dt_lcl}</span></li>
//         <li><span>到达:</span><span>{trace.air_seg_arrv_dt_lcl}</span></li>
//       </ul>
//       <img src={`images/life_class/${trace.catg}_life_big.png`}></img>
//     </div>
//   )
// }

// const fjJcgCard = (trace) => {
//   return (
//     <div className={cardClassName}>
//       <h1>{trace.hbh}</h1>
//       <ul>
//         <li><span>{trace.seg_dept_code_zhwz}</span><span>-</span><span>{trace.seg_dest_code_zhwz}</span></li>
//         <li><span>出发:</span><span>{trace.sta_depttm_zhwz}</span></li>
//         <li><span>到达:</span><span>{trace.sta_arvetm_zhwz}</span></li>
//       </ul>
//       <img src={`images/life_class/${trace.catg}_life_big.png`}></img>
//     </div>
//   );
// }

// const fjLgCard = (trace) => {
//   return (
//     <div className={cardClassName}>
//       <h1>{trace.hkgs + ":" + trace.hbh}</h1>
//       <ul>
//         <li><span>姓名:</span><span>{trace.lkzwxm}</span></li>
//         <li><span>座位:</span><span>{trace.lkzwxx}</span></li>
//         <li><span>{trace.jgsj}</span></li>
//       </ul>
//       <img src={`images/life_class/${trace.catg}_life_big.png`}></img>
//     </div>
//   );
// }

const stayCard = (trace, traceStyle) => {
    return (
        <div key={trace.hbaseKey} className={traceStyle}>
            <h1 title={trace.stayAddress}>{trace.stayAddress}</h1>
            <ul>
                <li><span>姓名:</span><span>{trace.name}</span></li>
                <li><span>登记:</span><span>{trace.recordTime}</span></li>
                <li><span>到期:</span><span>{trace.dueTime}</span></li>
            </ul>
            <img src={require(`../../images/life_class/${trace.catg}_life_big.png`)}></img>
        </div>
    );
}

// const zkZjCard = (trace) => {
//   return (
//     <div className={cardClassName}>
//       <h1 title={trace.zzdz}>{trace.zzdz}</h1>
//       <ul>
//         <li><span>姓名:</span><span>{trace.xm}</span></li>
//         <li><span>登记:</span><span>{trace.djrq_zhwz}</span></li>
//         <li><span>到期:</span><span>{trace.dqrq_zhwz}</span></li>
//       </ul>
//       <img src={`images/life_class/${trace.catg}_life_big.png`}></img>
//     </div>
//   );
// }


const hospitalCard = (trace, traceStyle) => {
    return (
        <div key={trace.hbaseKey} className={traceStyle}>
            <h1>{trace.hospital}</h1>
            <ul>
                <li><span>姓名:</span><span>{trace.name}</span></li>
                <li><span>{trace.visitTime}</span></li>
            </ul>
            <img src={require(`../../images/life_class/${trace.catg}_life_big.png`)}></img>
        </div>
    );
}

const ckCard = (trace, traceStyle) => {
    return (
        <div key={trace.hbaseKey} className={traceStyle}>
            <h1 title={trace.ssxq_zhwz + trace.xzjd_zhwz}>{trace.ssxq_zhwz + trace.xzjd_zhwz}</h1>
            <ul>
                <li><span>{trace.jlx_zhwz}</span></li>
                <li><span>{trace.pxh}</span></li>
                <li><span>{trace.hslbz_zhwz}</span></li>
            </ul>
            <img src={require(`../../images/life_class/${trace.catg}_life_big.png`)}></img>
        </div>
    );
}
//重点人员
const zdCard = (trace, traceStyle) => {
    return (
        <div key={trace.hbaseKey} className={traceStyle}>
            <h1>{trace.org_name}</h1>
            <ul>
                <li><span>姓名:</span><span>{trace.xm}</span></li>
                <li><span>{trace.online_time}</span></li>
            </ul>
            <img src={require(`../../images/life_class/${trace.catg}_life_big.png`)}></img>
        </div>
    );
}


const showContent = (trace, traceStyle) => {
    switch (trace.catg) {
        case "wb":
            return barCard(trace, traceStyle);
        //case "wb_zj": return wbZjCard(trace);
        case "lg":
            return hotelCard(trace, traceStyle);
        // case "lg_zj": return lgZjCard(trace);
        case "hc":
            return trainCard(trace, traceStyle);
        //case "hc_dp": return hcDpCard(trace);
        // case "hc_jz": return hcJzCard(trace);
        case "ky":
            return busCard(trace, traceStyle);
        case "fj":
            return flightCard(trace, traceStyle);
        //case "fj_dz": return fjDzCard(trace);
        //case "fj_jcg": return fjJcgCard(trace);
        //case "fj_lg": return fjLgCard(trace);
        case "zk":
            return stayCard(trace, traceStyle);//暂住
        //case "zk_zj": return zkZjCard(trace);
        case "yl":
            return hospitalCard(trace, traceStyle);
        //case "yl_ws": return ylWsCard(trace);
        case "ck":
            return ckCard(trace, traceStyle);
        case "zd":
            return zdCard(trace, traceStyle);
        default:
            return (<div>${trace.catg}</div>);
    }
}

const typeOptions = [
    {
        optionName: '旅馆', optionClass: 'lg-life', ischeck: true, value: 'lg',
    },
    {
        optionName: '飞机', optionClass: 'fj-life', ischeck: true, value: 'fj',
    },
    {
        optionName: '火车', optionClass: 'hc-life', ischeck: true, value: 'hc',
    },
    {
        optionName: '客运', optionClass: 'ky-life', ischeck: true, value: 'ky',
    },
    {
        optionName: '医疗', optionClass: 'yl-life', ischeck: true, value: 'yl',
    },
    {
        optionName: '暂口', optionClass: 'zk-life', ischeck: true, value: 'zk',
    },
    {
        optionName: '网吧', optionClass: 'wb-life', ischeck: true, value: 'wb',
    },
    {
        optionName: '其他', optionClass: 'qt-life', ischeck: true, value: 'qt',
    },
]


const dataTypeIsShow = (options, dataType) => {

    const filterOptions = options.filter((option) => {
        return option.value == dataType
    });
    if (filterOptions.length != 1) {
        console.error("value:%o,option 没有找到", dataType)
    }
    return filterOptions[0].ischeck;

    // const showConfigs = {};
    // options.map(item => {
    //   item.dataTypes.map(dataType => {
    //     showConfigs[dataType] = item.ischeck;
    //   })
    // })
    // return showConfigs[dataType];
}

//生成相同判断key
export function sameKeyGen(trace) {
    const day = String(trace.traceTime).substr(0, 8);
    switch (trace.catg) {
        case "lg":
            return `${day}-${trace.hotelName}-${trace.address}-${trace.roomNo}`;
        case "fj":
        case "wb":
        case "hc":
        case "yl":
        case "zk":
        case "qt":
        default:
            console.error("类型未设置md5编码：" + trace.catg);
            return `${trace.hbaseKey}`;
    }

    return "abc";
}

export default { typeOptions, showContent, dataTypeIsShow, sameKeyGen }