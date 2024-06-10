import React, { useState, useEffect } from 'react';
import { ResponsiveChoropleth } from '@nivo/geo';
import { Container } from 'react-bootstrap';
import Features from './features.json';

const MyResponsiveChoropleth = () => {
    const [projectionScale, setProjectionScale] = useState(230);
    const [containerHeight, setContainerHeight] = useState(500);
    const [data, setData] = useState([]);

    const apiURL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setProjectionScale(getScale(width));
            setContainerHeight(getHeight(width));
        };

        handleResize(); // Set initial values based on current window size
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getScale = (width) => {
        if (width < 600) return 100;
        if (width < 800) return 125;
        if (width < 1000) return 150;
        return 230;
    };

    const getHeight = (width) => {
        if (width < 600) return 300;
        if (width < 800) return 400;
        return 600;
    };

    const customTooltip = ({ feature }) => {
        return (
            <div style={{ padding: '5px 10px', color: '#faf3e6', background: '#091931', borderRadius: '3px' }}>
                <strong>{feature.properties.name}</strong>
                : {feature.value !== undefined ? feature.value : 'No data'}
            </div>
        );
    };

    const fetchData = async () => {
        try {
            const response = await fetch(`${apiURL}/countCompanies`);
            const jsonData = await response.json();
            setData(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    
    useEffect(() => {
        fetchData();
    }, []);
    useEffect(() => {
        console.log(data)
    }, [data]);


    return (
        <Container style={{ height: `${containerHeight}px` }} className='d-flex justify-content-center'>
            <ResponsiveChoropleth
                data={data}
                features={Features.features}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                colors="YlGnBu"
                domain={[0, 10]}
                isInteractive={true}
                unknownColor="#faf3e6"
                label="GEOsurf school's location"
                valueFormat=".2s"
                projectionScale={projectionScale}
                projectionType='mercator'
                projectionTranslation={[0.45, 0.65]}
                projectionRotation={[0, 0, 0]}
                enableGraticule={true}
                graticuleLineWidth={0.5}
                graticuleLineColor="#dddddd"
                borderWidth={0.2}
                borderColor="#091931"
                tooltip={customTooltip}
                defs={[
                    {
                        id: 'dots',
                        type: 'patternDots',
                        background: 'inherit',
                        color: '#38bcb2',
                        size: 4,
                        padding: 1,
                        stagger: true
                    },
                    {
                        id: 'lines',
                        type: 'patternLines',
                        background: 'inherit',
                        color: '#eed312',
                        rotation: -45,
                        lineWidth: 6,
                        spacing: 10
                    },
                    {
                        id: 'gradient',
                        type: 'linearGradient',
                        colors: [
                            {
                                offset: 0,
                                color: '#000'
                            },
                            {
                                offset: 100,
                                color: 'inherit'
                            }
                        ]
                    }
                ]}
                fill={[
                    {
                        match: {
                            id: 'CAN'
                        },
                        id: 'dots'
                    },
                    {
                        match: {
                            id: 'CHN'
                        },
                        id: 'lines'
                    },
                    {
                        match: {
                            id: 'ATA'
                        },
                        id: 'gradient'
                    }
                ]}
                legends={[
                    {
                        anchor: 'bottom-left',
                        direction: 'column',
                        justify: true,
                        translateX: 20,
                        translateY: -100,
                        itemsSpacing: 0,
                        itemWidth: 94,
                        itemHeight: 18,
                        itemDirection: 'left-to-right',
                        itemTextColor: '#444444',
                        itemOpacity: 0.85,
                        symbolSize: 18,
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemTextColor: '#000000',
                                    itemOpacity: 1
                                }
                            }
                        ]
                    }
                ]}
            />
        </Container>
    );
};

export default MyResponsiveChoropleth;