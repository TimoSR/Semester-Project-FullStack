import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { IActivity } from '../models/activity';
import {v4 as uuid} from 'uuid';

export default class ActivityStore {

    /** Real class data */
    activities: IActivity[] = [];
    selectedActivity: IActivity | undefined = undefined;
    editMode: boolean = false;
    loading: boolean = false;
    loadingInitial: boolean = false;

    /** Test Data */
    testTitle: string = 'Hello from MobX';

    constructor() {

        /**
         * Alternative to makeObservable
         */
        makeAutoObservable(this)


        // makeObservable(this, {
        //     title: observable,
        //     //setTitle: action.bound
        //     setTitle: action
        // })

    }

    /** We utilize async await instead of promises */
    loadActivities = async () => {

        this.loadingInitial = true;

        try {

            const activities = await agent.Activities.list();

            runInAction(() => {

                activities.forEach(activity => {
                    /**
                     * Based on the format of the data, we change it to fit the date form. 
                     * (We can inspect it in the Network repsonse from the server)
                     * We split the date based on the T, and take the first part now two elements. 
                     */
                    activity.date = activity.date.split('T')[0];
                    /** 
                     * Mutating state directly, would seem odd 
                     * would be seen as a anti pattern in redux.
                     * as we would not directly mutate the state
                     * but this is a core pattern of MobX
                     * */
                    
                    this.activities.push(activity);
                    

                })


                this.loadingInitial = false;


            })

            
        
        } catch (error) {

            console.log(error);

            runInAction (() => {

                this.loadingInitial = false;

            })
            
        }
    }

    selectActivity = (id: string) => {
        this.selectedActivity = this.activities.find(activity => activity.id === id);
    }

    cancelSelectedActivity = () => {
        this.selectedActivity = undefined;
    }

    openForm = (id?: string) => {
        id? this.selectActivity(id) : this.cancelSelectedActivity();
        this.editMode = true;
    }

    closeForm = () => {
        this.editMode = false;
    }

    createActivity = async (activity: IActivity) => {

        this.loading = true;

        /** Creating a guid id */
        activity.id = uuid();

        try {

            await agent.Activities.create(activity);

            runInAction(() => {
                this.activities.push(activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })

        } catch (error) {

            console.log(error);

            runInAction(() => {
                this.loading = false;
            })
            
        }
    }

    updateActivity = async (activity: IActivity) => {

        this.loading = true;

        try {

            await agent.Activities.update(activity);

            runInAction(() => {

                // Filter creates an array without the activity that will be replaced
                this.activities = [...this.activities.filter(a => a.id !== activity.id), activity]
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;

            })

        } catch (error) {

            console.log(error);

            runInAction(() => {
                this.loading = false;
            })

        }

    }

    deleteActivity = async (id: string) => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activities = [...this.activities.filter(a => a.id !== id)];
                this.loading = false;
            })
        } catch (error) {

            runInAction(() => {
                this.loading = false;
            })

        }
    }

    /** 
     * By using lamda functions we autobind the function to the class
     * Therefore by using lamda functions we don't need to bind setTitle in makeObservable
     */
     setTitle = () => {
        this.testTitle = this.testTitle + '!';
    }

    // setTitle() {
    //     this.title = this.title + '!';
    // }

}