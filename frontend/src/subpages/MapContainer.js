import React from "react";
import GoogleMapReact from 'google-map-react';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';

function Marker(props){
  return(
    <div>
      <Icon className="h1 m-0" style={{transform: "translate(-20px, -40px)"}} icon="mdi:map-marker"/>
      <p style={{width: 100, transform: "translate(20px, -90px)", fontWeight: "bold"}}>{props.name}</p>
    </div>
  )
}

export default function MapContainer(props){
  const [hotelInfo, setHotelInfo] = useState([]);
  const [activitiesInfo, setActivitiesInfo] = useState([]);

  useEffect(() => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      'credentials': 'include'
    };
    
    const fetchInfo = async () =>{
      let pins = await Promise.all(props.trip.hotel_ids.map(async (id) => {
        let res = await fetch("http://localhost:3001/hotel/" + id, requestOptions);
        let json = await res.json();
        return {name: json.hotel_name, lat: json.latitude, lng: json.longitude};
      }));

      setHotelInfo(pins);
    }

    fetchInfo();
  }, [props])

  useEffect(() => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      'credentials': 'include'
    };
    
    const fetchInfo = async () =>{
      let pins = await Promise.all(props.trip.activity_ids.map(async (id) => {
        let res = await fetch("http://localhost:3001/activity/" + id, requestOptions);
        let json = await res.json();
        return {name: json.name, lat: json.latitude, lng: json.longitude};
      }));

      setActivitiesInfo(pins)
    }

    fetchInfo();
  }, [props])

  const defaultProps = {
    center: {
      lat: props.trip.latitude,
      lng: props.trip.longitude
    },
    zoom: 10
  };

  // console.log(hotelInfo);

  return (
    // Important! Always set the container height explicitly
    <div style={{ height: '80vh', maxHeight: '1000px', width: '100%' }} className="card shadow mb-4">
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyDRSrRqfB6rbE-Ty2c_Ah9-E47FoJVHQ74" }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      > 
      {hotelInfo.map(hotel => <Marker name={hotel.name} lat={hotel.lat} lng={hotel.lng}/>)}
      {activitiesInfo.map(activity => <Marker name={activity.name} lat={activity.lat} lng={activity.lng}/>)}
      </GoogleMapReact>
    </div>
  );
}