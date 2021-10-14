import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Card } from 'react-native-elements';
import { FLatList } from 'react-native';
import * as Animatable from 'react-native-animatable';



class Contact extends Component {

    static navigationOptions = {
                title: 'Contact'
    };
        

    

    render() {
        return(
            <ScrollView>
                <Animatable.View animation='fadeInUp' duration={2000} delay={1000}>
                    <Card title="Contact Information" wrapperStyle={{margin: 20}}>
                        <Text>1 Nucamp Way</Text>
                        <Text>Seattle, WA 98001</Text>
                        <Text>U.S.A.</Text> 

                        <Text>Phone: 1-206-555-1234</Text>
                        <Text style={{marginBottom: 10}}>Email: campsites@nucamp.co</Text>
                    </Card>
                </Animatable.View>
            </ScrollView>
        )
    };
    
    
}   


export default Contact;