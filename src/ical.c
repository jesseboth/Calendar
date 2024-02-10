#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

#include <curl/curl.h>
#include "include/ical.h"
#include "include/Event.h"

#define MAX_LINE_LENGTH 1024

#define MAX_URL_LENGTH 1024
#define MAX_FILE_NAME_LENGTH 256

void print_hex(const char *str) {
    while (*str != '\0') {
        printf("%02X ", *str); // %02X formats the value as a two-digit hexadecimal number
        str++;
    }
    printf("\n");
}

void print_event(struct Event *event){
  printf("Summary: %s\n", event->summary);

  if(event->all_day){
    printf("All Day: true\n");
  }
  else{
    printf("Start: %s\n", event->start);
    printf("End: %s\n", event->end);
  }

  printf("Location: %s\n", event->location);
  printf("Description: %s\n", event->description);
}

void parse_timestamp(const char *timestamp, char *time, char* date, int* all_day) {

    // char *date[9]
    char *month = date;
    date[2] = '/';
    char *day = month+3;
    date[5] = '/';
    char *year = day+3;
    date[10] = '\0';

    // Extract year, month, day, hour, minute, and second from the timestamp string
    strncpy(year, timestamp, 4);
    strncpy(month, timestamp + 4, 2);
    strncpy(day, timestamp + 6, 2);

    if(timestamp[8] == 'T'){
      strncpy(time, timestamp + 9, 2);
      strncpy(time+2, timestamp + 11, 2);
      time[4] = '\0';
      *all_day = 0;
    }
    else{
      *time=0;
      *all_day=1;
    }

    printf("date: %s\ttime: %s\n", date, time);
}

void remove_carriage_return(char *str) {
    char *src = str; // Pointer to the source string
    char *dest = str; // Pointer to the destination string

    while (*src != '\0') {
        if (*src != '\r') {
            *dest = *src;
            dest++;
        }
        src++;
    }

    *dest = '\0';
}

void parse_iCal_file(const char *filename) {
    FILE *file = fopen(filename, "r");
    if (!file) {
        fprintf(stderr, "Error opening file\n");
        exit(EXIT_FAILURE);
    }

    char line[MAX_LINE_LENGTH];
    char key[MAX_LINE_LENGTH];
    char value[MAX_LINE_LENGTH];
    int in_event = 0;

    printf("[\n");

    while (fgets(line, MAX_LINE_LENGTH, file)) {
        if (sscanf(line, "%[^:]:%[^\n]", key, value) == 2) {
            // print_hex(value);
            if (strcmp(key, "BEGIN") == 0 && strcmp(value, "VEVENT\r") == 0) {
              // printf("%d %s %s\n", strcmp(value, "VEVENT\r"), key, value);
                if (in_event) {
                    printf("},\n");
                }
                printf("{\n");
                in_event = 1;

            } else if (in_event && strcmp(key, "DTSTART") == 0) {
              char time[4];
              char date[10];
              int all_day;
              parse_timestamp(value, time, date, &all_day);
            } else if (strcmp(key, "END") == 0 && strcmp(value, "VEVENT\r") == 0) {
                in_event = 0;
            } else if (in_event) {
                remove_carriage_return(value);
                // printf("\"%s\": \"%s\",\n", key, value);
            }
        }
    }

    if (in_event) {
        printf("}\n");
    }

    printf("]\n");

    fclose(file);
}

size_t write_callback(void *ptr, size_t size, size_t nmemb, FILE *stream) {
    return fwrite(ptr, size, nmemb, stream);
}

char* get_iCal(char *url) {
    static char file_name[MAX_FILE_NAME_LENGTH];

    // Extract file name from URL
    char *start = strrchr(url, '/');
    if (start != NULL) {
        start++;
        snprintf(file_name, MAX_FILE_NAME_LENGTH, "%s", start);
    } else {
        fprintf(stderr, "Error: Invalid URL\n");
        return 0;
    }

    CURL *curl;
    CURLcode res;
    FILE *file;

    curl_global_init(CURL_GLOBAL_ALL);
    curl = curl_easy_init();
    if (!curl) {
        fprintf(stderr, "Error initializing libcurl\n");
        return 0;
    }

    file = fopen(file_name, "wb");
    if (!file) {
        fprintf(stderr, "Error opening file\n");
        curl_easy_cleanup(curl);
        return 0;
    }

    curl_easy_setopt(curl, CURLOPT_URL, url);
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_callback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, file);

    res = curl_easy_perform(curl);
    if (res != CURLE_OK) {
        fprintf(stderr, "Error: %s\n", curl_easy_strerror(res));
        fclose(file);
        curl_easy_cleanup(curl);
        return 0;
    }

    fclose(file);
    curl_easy_cleanup(curl);
    curl_global_cleanup();

    sleep(5);
    printf("File downloaded successfully: %s\n", file_name);

    return file_name;
}

