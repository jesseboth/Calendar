#ifndef __EVENT_H__
#define __EVENT_H__

typedef struct Event{
    char *summary = NULL;
    int all_day = 0;
    char *todo = NULL;
    int start;
    int end;
    char *location = NULL;
    char *description = NULL;
};


#endif