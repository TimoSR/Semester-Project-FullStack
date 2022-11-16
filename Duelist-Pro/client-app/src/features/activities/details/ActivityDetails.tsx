import { observer } from 'mobx-react-lite';
import React from 'react';
import { Button, Card, Image } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';



export default observer(function ActivityDetails () {

    const {activityStore} = useStore();

    /** Deconstructering selectedActivity from activityStore and change the name to activity  */
    const {selectedActivity: activity, openForm, cancelSelectedActivity} = activityStore;

    return(
        /** We will use cards to display the activity details */
        <Card fluid>
            {/** Creating a dynamic string to receive the pictures */}
            <Image src={`/assets/categoryImages/${activity?.category}.jpg`} />
            <Card.Content>
                <Card.Header>{activity?.title}</Card.Header>
                <Card.Meta>{activity?.date}</Card.Meta>
                <Card.Description>{activity?.description}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button.Group widths ='2'>
                    {/** 
                     * It is important that we use a lamda function for onClick event. 
                     * As a regular function would trigger the moment we render it, 
                     * as it parses an arugment to selectActivty
                     * Where the lamda will wait on the onClick.  
                     * */}
                    <Button onClick={() => openForm(activity?.id)} basic color='blue' content ='Edit'></Button>
                     {/** 
                      * I don't get why lamda don't work with cancelSelectActivity
                      * Maybe because there is never given a parameter in that case? 
                      * */}
                    <Button onClick={cancelSelectedActivity} basic color='grey' content ='Cancel'></Button>
                </Button.Group>
            </Card.Content>
        </Card>
    )
})