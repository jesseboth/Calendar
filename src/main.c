#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <curl/curl.h>
#include "include/ical.h"

int main(int argc, char *argv[]) {
    if (argc != 2) {
        fprintf(stderr, "Usage: %s <url>\n", argv[0]);
        return 1;
    }

    // parse_iCal_file(get_iCal(argv[1]));

    parse_iCal_file("basic.ics");

    return 0;
}
