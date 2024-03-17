class NeuralNetwork{
    constructor(neuronCounts){
        //constructor is going to get an array of neuroncounts
        //this is going to be number of neurons in each layer
        this.levels=[];
        for(let i=0;i<neuronCounts.length-1;i++){
            this.levels.push(new Level(
                neuronCounts[i],neuronCounts[i+1]
            ));
        }
    }
    //Here we are putting int the output of the previous level into the new level as the input
    //And the final outputs will tell us if the car should go forward backward
    static feedForward(givenInputs,network){
        let outputs=Level.feedForward(
            //We are going to get outputs by calling the feedforward method from the level with the given inputs 
            givenInputs,network.levels[0]);
            //Now calling the first level to produce its output 
        for(let i=1;i<network.levels.length;i++){
             //Looping through the remaining levels like this we are going to update these outputs
             //with the feedforward result 
            outputs=Level.feedForward(
                outputs,network.levels[i]);
        }
        return outputs;
    }

    //Mutating Network
    static mutate(network,amount=1){
        network.levels.forEach(level => {
            for(let i=0;i<level.biases.length;i++){
                level.biases[i]=lerp(
                    level.biases[i],
                    Math.random()*2-1,
                    amount
                )
            }
            for(let i=0;i<level.weights.length;i++){
                for(let j=0;j<level.weights[i].length;j++){
                    level.weights[i][j]=lerp(
                        level.weights[i][j],
                        Math.random()*2-1,
                        amount
                    )
                }
            }
        });
    }
}

class Level{
    constructor(inputCount,outputCount){
        this.inputs=new Array(inputCount);
        //takes the input from ray casting
        this.outputs=new Array(outputCount);
        //gives output to car and according to this output vehicle is controlled
        this.biases=new Array(outputCount);
        //each output neuron has a bias
        //Bias is a value above which it will fire/take action

        this.weights=[];
        for(let i=0;i<inputCount;i++){
            this.weights[i]=new Array(outputCount);
            //for each input node we will have outputcount number of connections
        }

        //Setting some real values to brain to function
        Level.#randomize(this);
    }

    static #randomize(level){
        //We are defining a static method here because I want to serialize it
        //Serialize meaning is to the process of converting an object's state into a format that can be stored or transmitted.
        //and methods don't serialize that is why
        for(let i=0;i<level.inputs.length;i++){
            for(let j=0;j<level.outputs.length;j++){
                level.weights[i][j]=Math.random()*2-1;
                //For every input output pair we are initializing it with a random value between -1 and 1
                //Why negative value?
                //because consider a scenerio where car is moving in left most lane and suddenly a object comes infront of the car 
                //then to take the decision where car should turn left or right. When it will check that left is showing negative that
                //means car is not allowed to tak left turn then obviously it will take the right turn now
            }
        }

        for(let i=0;i<level.biases.length;i++){
            level.biases[i]=Math.random()*2-1;
        }
    }

    //To compute the output values we will be using feed-forward algorithm
    static feedForward(givenInputs,level){
        for(let i=0;i<level.inputs.length;i++){
            level.inputs[i]=givenInputs[i];
        }

        for(let i=0;i<level.outputs.length;i++){
            let sum=0
            for(let j=0;j<level.inputs.length;j++){
                sum+=level.inputs[j]*level.weights[j][i];
            }

            if(sum>level.biases[i]){
                level.outputs[i]=1;
            }else{
                level.outputs[i]=0;
            } 
        }

        return level.outputs;
    }
}