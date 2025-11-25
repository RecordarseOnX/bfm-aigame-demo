// src/components/Map.jsx
import React, { useEffect, useState, useMemo } from "react";
import { MapContainer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import { provinceCityMap } from "./provinceCityMap";
import * as topojson from "topojson-client";
import "leaflet/dist/leaflet.css";
import "./Map.css";

const ZOOM_THRESHOLD = 5;

// 配色方案
const palettes = {
  red: {
    light: ["#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d"],
    dark: ["#4a0d0d", "#67000d", "#a50f15", "#cb181d", "#ef3b2c", "#fb6a4a", "#ff4d4d"]
  },
  blue: {
    light: ["#f0f9ff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#3182bd"],
    dark: ["#0d1b2a", "#082d4f", "#08519c", "#2171b5", "#4292c6", "#6baed6", "#4da6ff"]
  },
  purple: {
    light: ["#f5f0ff", "#e5d9ff", "#d0bfff", "#b3a2ff", "#9e87ff", "#8a6dff", "#9e47ff"],
    dark: ["#2d0d4a", "#3f007d", "#542788", "#6a51a3", "#807dba", "#9e9ac8", "#b84dff"]
  },
  // --- 【修改】将 gray 重命名为 ink 以保持一致 ---
  ink: {
    light: ["#f7f7f7", "#d9d9d9", "#bdbdbd", "#969696", "#737373", "#525252", "#252525"],
    dark: ["#252525", "#404040", "#636363", "#828282", "#a1a1a1", "#d4d4d4", "#f0f0f0"]
  },
};

// ... (getHeatColor, formatNumber, ZoomHandler, ZoomToCity 函数保持不变)
function getHeatColor(value, min, max, theme, paletteName, useLogScale = false) {
  const palette = palettes[paletteName] || palettes.red;
  const colors = palette[theme] || palette.light;
  if (min === max || value <= 0) return colors[0];

  if (useLogScale) {
    value = Math.log(value + 1);
    min = Math.log(min + 1);
    max = Math.log(max + 1);
  }

  let ratio = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const pos = ratio * (colors.length - 1);
  let segment = Math.floor(pos);
  let segmentRatio = pos - segment;
  if (segment >= colors.length - 1) return colors[colors.length - 1];

  function interpolateColor(c1, c2, factor) {
    const col1 = parseInt(c1.slice(1), 16);
    const col2 = parseInt(c2.slice(1), 16);
    const r = Math.round(((col1 >> 16) & 0xff) + (((col2 >> 16) & 0xff) - ((col1 >> 16) & 0xff)) * factor);
    const g = Math.round(((col1 >> 8) & 0xff) + (((col2 >> 8) & 0xff) - ((col1 >> 8) & 0xff)) * factor);
    const b = Math.round((col1 & 0xff) + ((col2 & 0xff) - (col1 & 0xff)) * factor);
    return `rgb(${r},${g},${b})`;
  }

  return interpolateColor(colors[segment], colors[segment + 1], segmentRatio);
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function ZoomHandler({ setActiveLayer }) {
  const map = useMap();
  useEffect(() => {
    const handleZoom = () => {
      setActiveLayer(map.getZoom() < ZOOM_THRESHOLD ? "province" : "city");
    };
    handleZoom();
    map.on("zoomend", handleZoom);
    return () => map.off("zoomend", handleZoom);
  }, [map, setActiveLayer]);
  return null;
}

function ZoomToCity({ cityName, cityGeojsonData }) {
  const map = useMap();
  useEffect(() => {
    if (cityName && cityGeojsonData) {
      const feature = cityGeojsonData.features.find(f => f.properties.name === cityName);
      if (feature) {
        const layer = L.geoJSON(feature);
        map.fitBounds(layer.getBounds());
      }
    }
  }, [cityName, cityGeojsonData, map]);
  return null;
}


// 主 Map 组件
function Map({ onCityClick, theme = "light", mtbData, palette = "red", showProvince = true, zoomToCity }) {
  const [cityGeojsonData, setCityGeojsonData] = useState(null);
  const [provinceGeojsonData, setProvinceGeojsonData] = useState(null);
  const [activeLayer, setActiveLayer] = useState("province");

useEffect(() => {
    // 加载市级数据
    fetch("/中国_市.json")
      .then(res => res.json())
      .then(data => {
        // --- 核心修改开始 ---
        // 1. 动态获取 objects 里的第一个键名（不管它叫 'city' 还是 'layer1' 还是 '中国_市'）
        const mapName = Object.keys(data.objects)[0]; 
        
        if (!mapName) {
            console.error("TopoJSON 文件格式不对，找不到 objects");
            return;
        }

        // 2. 使用获取到的 key 进行转换
        const geojson = topojson.feature(data, data.objects[mapName]);
        // --- 核心修改结束 ---

        setCityGeojsonData(geojson);
      })
      .catch(error => console.error("加载市级地图数据失败:", error));

    // 加载省级数据 (同理优化)
    fetch("/中国_省.json")
      .then(res => res.json())
      .then(data => {
        const mapName = Object.keys(data.objects)[0]; // 自动抓取 key
        const geojson = topojson.feature(data, data.objects[mapName]);
        setProvinceGeojsonData(geojson);
      })
      .catch(error => console.error("加载省级地图数据失败:", error));
  }, []);

  useEffect(() => {
    if (!showProvince) setActiveLayer("city");
  }, [showProvince]);

  const cityHeatMap = useMemo(() => {
    if (!mtbData) return {};
    const heatMap = {};
    Object.entries(mtbData).forEach(([cityName, mtbs]) => {
      const totalOrders = mtbs.reduce((sum, mtb) => sum + (mtb.lastYearOrders || 0), 0);
      heatMap[cityName] = { mtbCount: mtbs.length, totalOrders };
    });
    return heatMap;
  }, [mtbData]);

  const provinceHeatMap = useMemo(() => {
    const map = {};
    if (!provinceCityMap) return map;
    provinceCityMap.forEach((cities, province) => {
      let mtbCount = 0, totalOrders = 0;
      cities.forEach(city => {
        const data = cityHeatMap[city];
        if (data) {
          mtbCount += data.mtbCount;
          totalOrders += data.totalOrders;
        }
      });
      map[province] = { mtbCount, totalOrders };
    });
    return map;
  }, [cityHeatMap]);

  const cityValues = Object.values(cityHeatMap).map(v => v.totalOrders).filter(v => v > 0);
  const cityMinHeat = cityValues.length > 0 ? Math.min(...cityValues) : 0;
  const cityMaxHeat = cityValues.length > 0 ? Math.max(...cityValues) : 1;

  const provinceValues = Object.values(provinceHeatMap).map(v => v.totalOrders).filter(v => v > 0);
  const provinceMinHeat = provinceValues.length > 0 ? Math.min(...provinceValues) : 0;
  const provinceMaxHeat = provinceValues.length > 0 ? Math.max(...provinceValues) : 1;

  // --- 【修改】添加 ink 配色的悬浮边框颜色 ---
  const paletteEdgeColor = { red: "#b94a48", blue: "#2171b5", purple: "#6a51a3", ink: "#666666" };
  const hoverBorderColor = theme === "light" ? paletteEdgeColor[palette] || "#444" : "#fff";

  // ... (onEachCity 和 onEachProvince 函数保持不变)
  const onEachCity = (feature, layer) => {
    const cityName = feature.properties.name;
    const data = cityHeatMap[cityName] || { mtbCount: 0, totalOrders: 0 };

    layer.setStyle({
      fillColor: getHeatColor(data.totalOrders, cityMinHeat, cityMaxHeat, theme, palette, true),
      fillOpacity: 0.75,
      color: "var(--city-line-color)",
      weight: 0.6,
      dashArray: "none",
    });

    layer.bindTooltip(
      `<div style="line-height:1.4; font-size:12px; padding:6px; background:var(--tooltip-bg); border-radius:4px; box-shadow:0 2px 4px rgba(0,0,0,0.1);">
        <strong>${cityName}</strong><br/>
        MTB 数：${formatNumber(data.mtbCount)}<br/>
        订单总数：${formatNumber(data.totalOrders)}
      </div>`,
      { sticky: true, direction: "right", className: "map-tooltip", offset: [10, 0] }
    );

    layer.on({
      mouseover: e => {
        e.target.setStyle({ weight: 1.5, color: hoverBorderColor, fillOpacity: 0.85 });
        e.target.bringToFront();
      },
      mouseout: e => {
        e.target.setStyle({ weight: 0.6, color: "var(--city-line-color)", fillOpacity: 0.75 });
      },
      click: () => onCityClick(feature.properties),
    });
  };

  const onEachProvince = (feature, layer) => {
    const provinceName = feature.properties.name;
    const data = provinceHeatMap[provinceName] || { mtbCount: 0, totalOrders: 0 };

    layer.setStyle({
      fillColor: getHeatColor(data.totalOrders, provinceMinHeat, provinceMaxHeat, theme, palette, true),
      fillOpacity: 0.7,
      color: "var(--province-line-color)",
      weight: 0.8,
      dashArray: "none",
    });

    layer.bindTooltip(
      `<div style="line-height:1.4; font-size:12px; padding:6px; background:var(--tooltip-bg); border-radius:4px; box-shadow:0 2px 4px rgba(0,0,0,0.1);">
        <strong>${provinceName}</strong><br/>
        MTB 总数：${formatNumber(data.mtbCount)}<br/>
        订单总数：${formatNumber(data.totalOrders)}
      </div>`,
      { sticky: true, direction: "right", className: "map-tooltip", offset: [10, 0] }
    );

    layer.on({
      mouseover: e => {
        e.target.setStyle({ weight: 1.8, color: hoverBorderColor, fillOpacity: 0.8 });
        e.target.bringToFront();
      },
      mouseout: e => {
        e.target.setStyle({ weight: 0.8, color: "var(--province-line-color)", fillOpacity: 0.7 });
      },
      click: e => e.target._map.fitBounds(e.target.getBounds()),
    });
  };

  return (
    <MapContainer
      center={[36, 108]}
      zoom={4}
      style={{ height: "100vh", width: "100%", backgroundColor: "var(--bg-color)" }}
      zoomControl={false}
      attributionControl={false}

      // --- 【新增】优化缩放体验的关键属性 ---

      // 1. 缩放吸附粒度 (最重要)
      //    值越小，缩放越平滑。0.1 是一个很好的选择。
      zoomSnap={0.1}

      // 2. 每次缩放的幅度
      //    建议和 zoomSnap 保持一致，让每次滚轮操作都感觉细腻。
      zoomDelta={0.1}

      // 3. (可选) 滚轮灵敏度
      //    这个值定义了滚动多少像素等于一个缩放级别。值越大，滚轮缩放越“慢”、越不灵敏。
      //    可以尝试 120 或 180 来获得更稳重的缩放手感。
      wheelPxPerZoomLevel={120}
    >
      {showProvince && <ZoomHandler setActiveLayer={setActiveLayer} />}
      {cityGeojsonData && <ZoomToCity cityName={zoomToCity} cityGeojsonData={cityGeojsonData} />}

      {provinceGeojsonData && activeLayer === "province" && (
        <GeoJSON
          key={"province-" + theme + palette + showProvince}
          data={provinceGeojsonData}
          onEachFeature={onEachProvince}
        />
      )}

      {cityGeojsonData && activeLayer === "city" && (
        <GeoJSON
          key={"city-" + theme + palette + showProvince}
          data={cityGeojsonData}
          onEachFeature={onEachCity}
        />
      )}
    </MapContainer>
  );
}

export default Map;