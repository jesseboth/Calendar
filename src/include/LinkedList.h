#ifndef __LINKED_LIST_H__
#define __LINKED_LIST_H__

#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

#include "event.h"
typedef Event *ll_elem;

/* Linked list node
    @param val      main value in list
    @param category additional modifier
    @param *next    next node
*/
typedef struct LinkedNode
{
    ll_elem val;    //value in list
    uint8_t category;           // 
    struct LinkedNode *next;   //next node
} LinkedNode;

/* Linked List naster struct 
    @param *head    first element
    @param *tail    last element
    @param *current current node for iteration
    @param length   current length
*/
typedef struct LinkedList
{
    LinkedNode *head;          //store head
    LinkedNode *tail;          //store tail
    LinkedNode *current;       // store curreent

    int length;                 //list length
} LinkedList;


/* Prints the linked list  
    @param *list    LinkedList
    @return -
*/
void print_LinkedList(LinkedList *list);

/* Creates a new node  
    @param val      main value
    @param cat      category value
    @return -
*/
LinkedNode *new_node(LinkedList_element val, uint8_t cat);

/* Free node  
    @param *node     linked list node
    @return -
*/
void free_node(LinkedNode *node);

/* Make a new list  
    @param -
    @return LinkedList*     initialzed linked list
*/
LinkedList *new_LinkedList();

/* Clear the entire list  
    @param *list    list to be freed
    @return -
*/
void free_LinkedList(LinkedList *list);

/* Append to linked list  
    @param *list    list to be appended to
    @param val      node value
    @param cat      node category
    @return -
*/
void LinkedList_prepend(LinkedList *list, LinkedList_element val, uint8_t cat);

/* Append to linked list  
    @param *list    list to be prepended to
    @param val      node value
    @param cat      category
    @return -
*/
void LinkedList_append(LinkedList *list, LinkedList_element val, uint8_t cat);

/* Get a value from a specific index  
    @param *list    linked list
    @param i        index
    @return -
*/
LinkedList_element LinkedList_index(LinkedList *list, int i);


// TODO

/* Get a node from a specific index  
    @param *list            linked list
    @param i                index
    @return -
*/
LinkedNode *LinkedList_index_node(LinkedList *list, int i);

/* Remove a node from a specific index - frees node
    @param *list            linked list
    @param in
    @return -
*/
void LinkedList_remove_index(LinkedList *list, int i);

/* Remove a node from a specific index
    @param *list            linked list
    @param i                index
    @return LinkedNode*    at index
*/
LinkedNode *LinkedList_remove_index_node(LinkedList *list, int i);

/* Remove a node at head - frees node
    @param *list             linked list
    @return -
*/
void LinkedList_remove_head(LinkedList *list);

/* Remove node at head
    @param *list            linked list
    @return LinkedNode*    at head
*/
LinkedNode *LinkedList_remove_head_node(LinkedList *list);


/* Remove node at head - frees node
    @param *list            linked list
    @return -
*/
void LinkedList_remove_tail(LinkedList *list);

/* Remove tail 
    @param *list            linked list
    @return lined_node*     at tail
*/
LinkedNode *LinkedList_remove_tail_node(LinkedList *list);

#endif