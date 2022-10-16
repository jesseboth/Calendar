#include "include/linked_list.h"

void print_LinkedList(LinkedList *list){
    LinkedNode *node = list->head;
    while(node){
        printf("%s ->", node->val);
        node = node->next;
    }   
    printf("\n");
}   

/*create a node*/
LinkedNode *new_Node(LinkedList_element val, uint8_t cat){
    LinkedNode *ret = malloc(sizeof(LinkedNode));

    ret->val = val;
    ret->category = cat;
    ret->next = NULL;
    return ret;
}

/*free a node*/
void free_Node(LinkedNode *node){
    node->val = NULL;
    node->category = 0;
    node->next = NULL;
    free(node);
}

/*initialize new linked list*/
LinkedList *new_LinkedList(){
    LinkedList *ret = malloc(sizeof(LinkedList));

    ret->head = NULL;
    ret->tail = NULL;
    ret->current = NULL;

    ret->length = 0;
    return ret;
}

/*free list and nodes*/
void free_LinkedList(LinkedList *list){
    LinkedNode *cur, *temp;
    cur = list->head;
    while (cur != NULL)
    {
        temp = cur->next;
        free_Node(cur);
        cur = temp;
    }

    list->head = NULL;
    list->tail = NULL;
    
    list->length = 0;
}

void LinkedList_prepend(LinkedList *list, LinkedList_element val, uint8_t cat){
    LinkedNode *node = new_Node(val, cat);
    node->next = list->head;
    list->head = node;
    if (list->tail == NULL){
        list->tail = list->head;
    }
    list->length++;
}

void LinkedList_append(LinkedList *list, LinkedList_element val, uint8_t cat){
    if (list->tail == NULL){
        LinkedList_prepend(list, val, cat);
    }
    else{
        LinkedNode *node = new_Node(val, cat);
        list->tail->next = node;
        list->tail = node;
        list->length++;
    }
}

LinkedList_element LinkedList_index(LinkedList *list, int i){
    return LinkedList_index_Node(list, i)->val;
}

LinkedNode *LinkedList_index_Node(LinkedList *list, int i){
    if(i >= list->length){
        printf("Index out of Bounds");
        return NULL;
    }
    LinkedNode *node = list->head;
    for(int j = 0; j<i; j++){
        node = node->next;
    }
    return node;
}

void LinkedList_remove_index(LinkedList *list, int i){
    free(LinkedList_remove_index_Node(list, i));
}

LinkedNode *LinkedList_remove_index_Node(LinkedList *list, int i){
    if(i >= list->length){
        printf("Index out of Bounds");
        return NULL;
    }
    LinkedNode *node = list->head;
    LinkedNode *prev = NULL;
    for(int j = 0; j<i; j++){
        prev = node;
        node = node->next;
    }

    // set previous next
    if(prev){prev->next = node->next;}

    // set head/tail
    if(i == 0){
        list->head = node->next;
    }
    else if(i == list->length-1){
        list->tail = prev;
    }

    // decrement length
    list->length--;

    return node;
}

void LinkedList_remove_head(LinkedList *list){
    free(LinkedList_remove_index_Node(list, 0));
}

LinkedNode *LinkedList_remove_head_Node(LinkedList *list){
    return LinkedList_remove_index_Node(list, 0);
}

void LinkedList_remove_tail(LinkedList *list){
    free(LinkedList_remove_index_Node(list, list->length-1));
}

LinkedNode *LinkedList_remove_tail_Node(LinkedList *list){
    return LinkedList_remove_index_Node(list, list->length-1);
}
