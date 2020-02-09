import './App.css';
import * as React from "react";
import data from './data/data.json';
// @ts-ignore
import {Map as BMapComponent, Marker, Circle, NavigationControl, InfoWindow} from "react-bmap"
import {Location, Person} from "./data/model";
import dayjs from "dayjs";
import {CSSProperties} from "react";

interface State {
    currentData: Set<Person>;
    currentTime: Date;
    height: number;
}

const startTime = dayjs('2020-01-11').toDate();
const TimeStep: number = 3600 * 24 * 1000;
const list: Array<Person> = [];

function readJson() {
    for (let i = 0; i < data.length; i++) {
        // @ts-ignore
        let person: Person = {};
        list.push(person);
        let item = data[i];
        person.name = item.name;
        person.age = item.age;
        person.sex = item.sex;
        person.address = item.address;
        person.myParentNCP = item.myParentNCP;
        person.info = item.info;
        person.reportTime = dayjs(item.reportTime).toDate();
        parsePath(item, person);
    }
}

function parsePath(o: any, person: Person): void {
    const path: object = o.path;
    person.path = new Map<number, Array<Location>>();
    const keys: string[] = Object.keys(path);
    keys.forEach(key => {
        const date = dayjs(key).toDate();
        // @ts-ignore
        const array: Array<any> = path[key];
        const locations: Array<Location> = array.map(item => {
            return {
                lat: item.lat,
                lng: item.lng,
                address: item.address,
                time: dayjs(item.time).toDate()
            }
        });
        person.path.set(date.getTime(), locations);
    });
}

function filterPersonByDate(time: Date, list: Array<Person>): Array<Person> {
    const result: Array<Person> = new Array<Person>();
    const day = new Date();
    day.setFullYear(time.getFullYear(), time.getMonth(), time.getDate());
    day.setHours(0, 0, 0, 0);
    console.log('xx', dayjs(day).format('YYYY-MM-DD HH:mm:ss'));
    console.log('xx list x');
    for (let i = 0; i < list.length; i++) {
        console.log('xx list');
        let person = list[i];
        if (person.path.has(day.getTime())) {
            console.log('xx path.has(day)');
            // @ts-ignore
            const locations: Array<Location> = person.path.get(day.getTime());
            for (let j = 0; j < locations.length; j++) {
                const location = locations[j];
                let locationTime: number = location.time.getTime();
                let currentTime = time.getTime();
                if (currentTime <= locationTime && (currentTime + TimeStep) > locationTime) {
                    console.log('xx location.has(time)');
                    person.currentLocation = location;
                    result.push(person);
                    break;
                }
            }
        }
    }
    return result;
}

export class App extends React.PureComponent<any, State> {
    private stepCount: number = 0;
    private endTime = new Date();
    private requestFrameId: undefined | number;
    private frameTime: number = 0;
    // @ts-ignore
    private icon = new BMap.Icon('public/dot.png', new BMap.Size(32, 32), {
        // @ts-ignore
        imageSize: new BMap.Size(32, 32)
    });

    constructor(props: any, context: any) {
        super(props, context);
        this.state = {
            currentTime: startTime,
            currentData: new Set<Person>(),
            height: 0
        }
    }

    componentDidMount(): void {
        readJson();
        this.update();
    }

    private update() {
        this.requestFrameId = requestAnimationFrame((time: number) => {
            if (time - this.frameTime > 1000) {
                console.log('requestAnimationFrame', time, 'xxx');
                this.frameTime = time;
                this.updateNCP(new Date(this.state.currentTime.getTime()+TimeStep));
            }
            this.update();
        });
    }

    componentWillUnmount(): void {
        if (this.requestFrameId) {
            cancelAnimationFrame(this.requestFrameId);
        }
    }

    render() {
        const marks: Array<any> = [];
        this.state.currentData.forEach(person => {
            marks.push(<Marker position={{lng: person.currentLocation.lng, lat: person.currentLocation.lat}}
                               icon={{imageUrl: '/dot.png'}}/>);
        });
        console.log('render', marks.length);
        return <div style={{height: '100%', width: '100%'}}>
            <BMapComponent center={{lng: 114, lat: 32}} zoom={7} style={{height: window.innerHeight}}>
                {marks}
                <NavigationControl/>
            </BMapComponent>
            <div style={{
                position: 'absolute',
                right: 0,
                top: 0,
                height: '30',
                justifyContent: 'center',
                display: 'flex',
                width: '100%',
                alignItems: 'flex-start',
                alignContent: 'center'
            }}>{dayjs(this.state.currentTime).format("YYYY-MM-DD HH:mm:ss")}</div>
        </div>;
    }

    private updateNCP(time: Date): void {
        const currentData = filterPersonByDate(time, list);
        console.log('updateNCP', currentData.length);
        const newData = new Set(this.state.currentData);
        currentData.forEach(p => {
            newData.add(p);
        });
        this.setState({
            currentData: newData,
            currentTime: time
        });
    }
}

export default App;
