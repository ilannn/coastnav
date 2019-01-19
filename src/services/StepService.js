import { StepType } from '../models/steps';
import geolib from 'geolib';
import { LatLng } from 'leaflet';
import _ from 'lodash';

export default class StepService {
    constructor() {
        this.id = 1;
    }

    getSteps = (limit) => {
        return [
            {
                id: this.id++, type: StepType.GUIDELINE,
                positions: [{ lat: 32.374, lng: 35.116 }, { lat: 32.4, lng: 35.2 }],
                color: "black",
                marker: {
                    position: null,
                    percentage: 50, // center
                }
            },
            {
                id: this.id++, type: StepType.TB,
                positions: [{ lat: 32.4, lng: 35.2 }, { lat: 32.4234, lng: 35.2234 }],
                color: "black",
                time: new Date(),
                marker: {
                    position: null,
                    percentage: 50, // center
                }
            }
        ]
    }

    createNewStep = (lat = 0, lng = 0, stepType = StepType.GUIDELINE) => {
        let newStep = {
            id: this.id++, type: stepType,
            positions: [{ lat, lng }, { lat, lng }],
            marker: { position: null, percentage: 50 }
        }
        if (stepType !== StepType.GUIDELINE) {
            return {
                ...newStep,
                time: new Date(),
            }
        }
        return newStep;
    }

    createNewSnappedStep = (lat = 0, lng = 0, stepType = StepType.GUIDELINE, options = []) => {
        let nearestPoint = StepService.getNearestPosition(
            { lat, lng }, options
        );
        return this.createNewStep(nearestPoint.lat, nearestPoint.lng, stepType)
    }

    static formatCoordinate = (coord) => {
        return geolib.decimal2sexagesimal(coord);
    }
    
    static unformatCoordinate = (coord) => {
        return geolib.sexagesimal2decimal(coord);
    }

    static calcAngle = function (p1, p2, direction) {
        let lat1 = p1.lat / 180 * Math.PI;
        let lat2 = p2.lat / 180 * Math.PI;
        let lng1 = p1.lng / 180 * Math.PI;
        let lng2 = p2.lng / 180 * Math.PI;
        let y = Math.sin(lng2 - lng1) * Math.cos(lat2);
        let x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1);
        let brng;
        if (direction === "inbound") {
            brng = (Math.atan2(y, x) * 180 / Math.PI + 180).toFixed(0);
        } else {
            brng = (Math.atan2(y, x) * 180 / Math.PI + 360).toFixed(0);
        }
        return (brng % 360);
    }

    static calcDistance = function (p1, p2) {
        let unit = "mi";
        let dist = geolib.getDistanceSimple(p1, p2);
        dist = geolib.convertUnit('mi', dist);
        return { dist, unit };
    }

    /**
     * Finding diff between one old step and new one, 
     * and calc step's updates props.
     * @param {NavStep} oldStep 
     * @param {L.Polyline} oldStepPolyline 
     * @param {NavStep} newStep 
     */
    static getUpdatedStepWithChanges(oldStep, oldStepPolyline, newStep) {
        // Check diff
        let compareKeys = oldStep.marker || newStep.marker ? ["positions", "marker"] : ["positions"];
        let differences = compareKeys.filter(k => {
            if (typeof newStep[k] === 'object') {
                return !_.isEqual(newStep[k], oldStep[k]);
            }
            return newStep[k] !== oldStep[k];
        });

        if (!differences.length) return oldStep;

        let updatedStep = Object.assign({}, oldStep);

        if (differences.includes("positions")) {
            Object.assign(updatedStep, {
                positions: [
                    oldStep.positions[0],
                    StepService.calcNewEnding(oldStepPolyline, newStep)
                ]
            });
        }

        if (newStep.marker) {
            Object.assign(updatedStep, {
                marker: {
                    ...oldStep.marker
                }
            });
        }

        return updatedStep;
    }

    static calcNewEnding(from, length, angle) {
        length = length * 1609.344; // convert to meters
        let p2 = geolib.computeDestinationPoint(from, length, angle);
        return new LatLng(p2.latitude.toFixed(5), p2.longitude.toFixed(5));
    }

    static calcNewMarkerPosition(from, to, percentage) {
        let angle = StepService.calcAngle(from, to);
        let length = geolib.getDistanceSimple(from, to);
        length = length * (percentage / 100);
        let p2 = geolib.computeDestinationPoint(from, length, angle);
        return new LatLng(p2.latitude.toFixed(8), p2.longitude.toFixed(8));
    }

    static isNorth(angle) {
        angle = angle % 360;
        return (angle < 90 || angle > 270);
    }

    static getNearestPosition(from, options, ignoreOptions = [], limit = 1500) {
        // Flattern options, to insure flat options list
        options = _.flattenDeep(_.map(options, option => _.flatten(option.positions)));
        // fliter out ignored options
        options = _.filter(options, option => _.findIndex(ignoreOptions, option) < 0)
        // If no options left - return given point
        if (_.isEmpty(options)) return from;
        // Otherwise - find nearest path
        let nearestPoint = geolib.findNearest(from, options);
        if (isNaN(nearestPoint.distance) || nearestPoint.distance > limit || nearestPoint.key === -1) {
            nearestPoint = from;
        } else {
            nearestPoint = options[nearestPoint.key];
        }
        return nearestPoint;
    }
}