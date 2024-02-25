"use client"
import {useEffect} from "react";
import markerSDK from '@marker.io/browser';

export default function MarkerComponent() {
  useEffect(() => {
    markerSDK.loadWidget({
      project: '65db7ba2523f9b37290ae77f',
    });
  }, []);

  return null;
}
