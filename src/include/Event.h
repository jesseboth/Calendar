#ifndef __EVENT_H__
#define __EVENT_H__

typedef struct Event {
    char *summary;
    int all_day;
    char *todo;
    char* start;
    char* end;

    char* startDate;
    char* endDate;
    char *location;
    char *description;

    char* icalDay;
};


#endif