import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, 
    Modal, Button, StyleSheet,
    Alert, PanResponder } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return{
        campsites: state.campsites,
        comments: state.comments,
        favorites: state.favorites,

    };
};

const mapDispatchToProps = {
    postFavorite: campsiteId => (postFavorite(campsiteId)),
    postComment: (campsiteId, rating, author, text) => postComment(campsiteId, rating, author, text)
}

function RenderCampsite(props) {

    const {campsite} = props;

    const view = React.createRef();


    const recognizeDrag = ({dx}) => (dx < -200) ? true : false;

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
            view.current.rubberBand(1000)
            .then(endState => console.log(endState.finished ? ' finished' : 'canceled'));
        },
        onPanResponderEnd: (e, gestureState) => {
            console.log('pan responder end', gestureState);
            if(recognizeDrag(gestureState)) {
                Alert.alert(
                    'Add Favorite',
                    'Are you sure you wish to add ' + campsite.name + ' to your favorites?',
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                            onPress: () => console.log('Cancel Pressed')
                        },
                        {
                            text: 'OK',
                            onPress: () => props.favorite ?
                                console.log('Already set as a favorite') : props.markFavorite()
                        }
                    ],
                    { cancelable: false }
                );
            }
            return true;
        }
    });

    if(campsite) {
        return (
            <Animatable.View 
            animation='fadeInDown' 
            duration={2000} 
            delay={1000}
            ref={view}
            {...panResponder.panHandlers}>
                <Card
                    featuredTitle={campsite.name}
                    image={{uri: baseUrl + campsite.image}}>
                    <Text style={{margin:10}}>
                        {campsite.description}
                    </Text>
                    <View style={styles.cardRow}>
                        <Icon
                            name={props.favorite ? 'heart' : 'heart-o'}
                            type='font-awesome'
                            color='#f50'
                            raised
                            reverse
                            onPress={() => props.favorite ?
                                console.log('Already set as a favorite') : props.markFavorite()}
                        />
                        <Icon 
                            name='pencil'
                            type="font-awesome"
                            color='#5637DD'
                            raised
                            reverse
                            onPress={() => props.onShowModal()}
                        />
                    </View>    
                </Card>
            </Animatable.View>    
        ); 
    }
    return <View />;
}

function RenderComments({comments}) {

    const renderCommentItem = ({item}) => {
        return (
            <View style={{margin: 10}}>
                <Text style={{fontSize: 14}}>
                    {item.text} 
                </Text>
                <Rating
                    startingValue={item.rating}
                    imageSize={10} 
                    style={{alignItems:'flex-start', paddingVertical:'5%'}}
                    readonly
                    style={{alignItems: 'flex-start', paddingVertical: '5%'}}
                />
                <Text style={{fontSize: 12}}>
                    {`--${item.author}, ${item.date}`}
                </Text>
            </View>
        );
    };

    return (
        <Animatable.View animation='fadeInUp' duration={2000} delay={1000}>
            <Card title="Comments">
                <FlatList
                    data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.id.toString()} 
                />
            </Card>
        </Animatable.View>    
    )
}

class CampsiteInfo extends Component {

    constructor(props) {
        super(props);

        this.state = {
            rating: 5,
            author: '',
            text: '',
            showModal: false
        }
    }   
    
    toggleModal() {
        this.setState({showModal: !this.state.showModal});
    }

    handleComment(campsiteId) {
        this.props.postComment(campsiteId, rating, author, text);
        this.toggleModal();
    }

    resetForm() {
        this.setState({
            showComment: false
        });
    }

    markFavorite(campsiteId){
        this.props.postFavorite(campsiteId);
    }

    static navigationOptions = {
        title: 'Campsite Information'
    }

    render() {
        const campsiteId = this.props.navigation.getParam('campsiteId');
        const campsite = this.props.campsites.campsites.filter(campsite => campsite.id === campsiteId)[0];
        const comments = this.props.comments.comments.filter(comment => comment.campsiteId === campsiteId);
        return (
            <ScrollView>
                <RenderCampsite campsite={campsite}
                    favorite={this.props.favorites.includes(campsiteId)}
                    markFavorite={() => this.markFavorite(campsiteId)}
                    onShowModal={() => this.toggleModal()}
                />
                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.showModal}
                    onRequestClose={() => this.toggleModal()}
                    style={styles.modal}
                >
                    <View style={styles.modal}>
                            <Rating
                                type='star'
                                ratingCount={5}
                                imageSize={40}
                                showRating
                                onFinishRating={rating => this.setState({rating: rating})}
                                style={{paddingVertical: 10}}
                                style={{margin: 50}}
                            />

                            <Input
                                placeholder="Your Name"
                                leftIcon={{ type: 'font-awesome', name: 'user-circle' }}
                                style={styles}
                                onChangeText={author => this.setState({ author: author })}
                            />

                            <Input
                                placeholder="Comment"
                                leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
                                leftIconContainerStyle={{paddingRight: 10}}
                                onChangeText={comment => this.setState({ comment: comment })}
                            />

                            <View style={{margin: 20}}>
                                <Button
                                onPress={() => {
                                        this.toggleModal(campsiteId);
                                        this.resetForm(campsiteId);
                                }}
                                color='#5637DD'
                                title='Submit'
                            />
                            </View>

                            <View style={{margin: 40}}>
                                <Button
                                    onPress={() => {
                                        this.toggleModal();
                                        this.resetForm();
                                    }}
                                    color='red'
                                    title='Cancel'
                                />
                            </View>    
                    </View>
                </Modal>

                <RenderComments comments={comments} />
            </ScrollView>
            );    

    }    
}

const styles = StyleSheet.create ({
    cardRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    }
})


export default connect(mapStateToProps, mapDispatchToProps)(CampsiteInfo);