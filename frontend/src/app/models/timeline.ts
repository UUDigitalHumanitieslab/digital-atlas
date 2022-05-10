import { Legacy, LifeEvent, Work } from './data';

type TimelineData = LifeEvent | Work | Legacy;

export type EventType = TimelineData['type'];

export type TimelineEvent = {
    startYear: number,
    endYear: number,
    dateString: string, // human-readable description of the date / time range
    authorId: number,
    author: string,
    type: EventType,
    data: TimelineData,
};

/** element in the timeline layout - either the container for an event or empty filling */
export type TimelineTile = {
    span: number,
    startYear: number,
    endYear: number,
    event?: TimelineEvent,
};
