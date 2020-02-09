export interface Person {
    id: string;
    name: string;
    age: number; // default -1。表示未知
    sex: number; // default -1。表示未知。0 女，1男
    address: string;
    myParentNCP: string;
    info: string;
    reportTime: Date;
    path: Map<number, Array<Location>>;
    currentLocation: Location;
}

export interface Location {
    lat: number;
    lng: number;
    address: string;
    time: Date;
}
