import React, { useEffect, useMemo, useState } from 'react';
import { MapSourceData } from '../../Definitions/Definitions/mapComponent.definitions';
import { MapComponent } from './mapComponent';
import { FormInstance } from 'antd';

interface CMAMapComponentProps {
  form: FormInstance;
  formItemName: any;
  listName?: string;
  existingCordinate?: any[];
}

const GetLocationMapComponent = (props: CMAMapComponentProps) => {
  const { form, formItemName, listName, existingCordinate } = props;

  const mapType = process.env.REACT_APP_MAP_TYPE ? process.env.REACT_APP_MAP_TYPE : 'None';
  const accessToken = process.env.REACT_APP_MAPBOXGL_ACCESS_TOKEN
    ? process.env.REACT_APP_MAPBOXGL_ACCESS_TOKEN
    : '';

  const getCenter = (list: any[]) => {
    let count = 0;
    let lat = 0;
    let long = 0;
    for (const l of list) {
      if (l === null || l === 'null') {
        continue;
      }
      count += 1;
      lat += l[0];
      long += l[1];
    }
    return [lat / count, long / count];
  };

  const [projectLocation, setProjectLocation] = useState<any[]>(existingCordinate || []);
  const [projectLocationMapSource, setProjectLocationMapSource] = useState<any>();
  const [projectLocationMapLayer, setProjectLocationMapLayer] = useState<any>();
  const [projectLocationMapOutlineLayer, setProjectLocationMapOutlineLayer] = useState<any>();
  const [projectLocationMapCenter, setProjectLocationMapCenter] = useState<number[]>([]);

  useEffect(() => {
    setProjectLocationMapCenter(
      projectLocation?.length > 0 ? getCenter(projectLocation) : [80.7718, 7.8731]
    );

    const mapSource: MapSourceData = {
      key: 'projectLocation',
      data: {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [projectLocation],
          },
          properties: null,
        },
      },
    };

    setProjectLocationMapSource(mapSource);

    setProjectLocationMapLayer({
      id: 'projectLocation',
      type: 'fill',
      source: 'projectLocation',
      layout: {},
      paint: {
        'fill-color': '#0080ff',
        'fill-opacity': 0.5,
      },
    });

    setProjectLocationMapOutlineLayer({
      id: 'projectLocationOutline',
      type: 'line',
      source: 'projectLocation',
      layout: {},
      paint: {
        'line-color': '#000',
        'line-width': 1,
      },
    });
  }, [projectLocation]);

  const onPolygonComplete = function (data: any) {
    if (data.features.length > 0) {
      // console.log('-----polygon complete func running------', formItemName);
      const coordinates = data.features[0].geometry.coordinates[0];
      // formOne.setFieldValue('projectLocation', coordinates);
      if (listName !== undefined) {
        const listFields = form.getFieldValue(listName);
        // console.log('----------listName------------', listFields);
        if (listFields[formItemName[0]] !== undefined) {
          listFields[formItemName[0]][formItemName[1]] = coordinates;
        } else {
          listFields[formItemName[0]] = {
            [formItemName[1]]: coordinates,
          };
        }
        // console.log('-----------list fields after filling-----------', listFields);
        // form.setFieldValue({
        //   listName: form.getFieldValue(listName)
        // })
        form.setFieldValue(listName, listFields);
      } else {
        form.setFieldValue(formItemName, coordinates);
      }
      setProjectLocation(coordinates);
    }
  };

  const mapComponentMemoizedValue = useMemo(() => {
    return (
      <MapComponent
        mapType={mapType}
        center={projectLocationMapCenter}
        zoom={4}
        height={400}
        style="mapbox://styles/mapbox/light-v11"
        accessToken={accessToken}
        onPolygonComplete={onPolygonComplete}
        mapSource={projectLocationMapSource}
        layer={projectLocationMapLayer}
        outlineLayer={projectLocationMapOutlineLayer}
      ></MapComponent>
    );
  }, [
    projectLocationMapCenter,
    projectLocationMapSource,
    projectLocationMapLayer,
    projectLocationMapOutlineLayer,
  ]);

  return mapComponentMemoizedValue;
};

export default GetLocationMapComponent;
