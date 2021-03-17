 import React, { useState } from "react";
import { Col, Row } from "antd";
import ObserverInfo from "./ObserverInfo";
import { NEARBY_SATELLITE, SAT_CATEGORY, NY20_API_KEY } from "../constants";
import SatelliteList from "./SatelliteList";
import WorldMap from "./WorldMap";

export const ABOVE_API_BASE_URL = `/api/${NEARBY_SATELLITE}`;

const Main = () => {
  const [loading, setLoading] = useState(false);
  const [satList, setSatList] = useState([]);
  const [trakcing, setTracking] = useState(false);
  const [observerInfo, setObserverInfo] = useState({});

  const findSatellitesOnClick = (nextObserverInfo) => {
    setObserverInfo(nextObserverInfo);
    const { longitude, latitude, altitude, radius } = nextObserverInfo;

    setLoading(true);
    fetch(`/api/${NEARBY_SATELLITE}/${latitude}/${longitude}/${altitude}/${radius}/${SAT_CATEGORY}&apiKey=${NY20_API_KEY}`)
      .then(response => response.json())
      .then(data => {
        setSatList(data.above.map((satellite) => {
          return {
            ...satellite,
            selected: false,
          }
        }));
        setLoading(false);
      })
      .catch(() => {
        // Do things when API call fails
        setLoading(false);
      });
  }

  return (
    <Row>
      <Col span={8}>
        <ObserverInfo 
          findSatellitesOnClick={findSatellitesOnClick}
          loading={loading}
          disabled={trakcing}
        />
        <SatelliteList 
          satList={satList}
          updateSatelliteList={setSatList}
          loading={loading}
          disabled={trakcing}
        />
      </Col>
      <Col span={16}>
        <WorldMap 
          selectedSatellites={satList.filter(sat => sat.selected)}
          onTracking={setTracking}
          disabled={trakcing}
          observerInfo={observerInfo}
        />
      </Col>
    </Row>
  )
}

export default Main;
