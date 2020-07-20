/* eslint-disable react-hooks/exhaustive-deps */
import React, {Component} from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {cover} from '../../assets';
import {Card} from '../../components';
import {getBook} from '../../redux/actions/book';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      book: this.props.book.value || [],
      keyword: '',
      sort: 'title-asc',
    };
  }
  fetchBook = async (search, sort) => {
    await this.props
      .dispatch(getBook(this.props.auth.data.token, search, sort))
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  };

  componentDidMount() {
    this.fetchBook('', this.state.sort);
  }

  componentDidUpdate() {
    console.log('update');
  }

  handleSearch = () => {
    this.fetchBook(this.state.keyword);
  };
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground source={cover} style={styles.background}>
          <TextInput
            style={styles.search}
            placeholder="Book Title...."
            value={this.state.keyword}
            onChangeText={(keyword) => this.setState({keyword: keyword})}
            // onKeyPress={this.handleSearch.bind(this)}
            // onKeyPress={({nativeEvent}) => {
            //   console.log(nativeEvent);
            // }}
            onBlur={() => {
              this.handleSearch();
            }}
          />
        </ImageBackground>
        <View style={styles.content}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Book List</Text>
            <Button
              title="SORT"
              onPress={async () => {
                await this.setState({sort: 'title-desc'});
                this.fetchBook('', this.state.sort).then((res) => {
                  // console.log(this.props.book.value);
                  this.setState({book: this.props.book.value});
                });
              }}
            />
            {this.state.book
              ? this.state.book.map((data) => {
                  return (
                    <Card
                      key={data.id}
                      title={data.title}
                      description={data.description}
                      image={`http://192.168.43.81:3000/images/${data.image}`}
                      onPress={async () => {
                        this.props.navigation.navigate('Detail', {id: data.id});
                      }}
                    />
                  );
                })
              : null}
          </ScrollView>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  book: state.book,
  auth: state.auth,
});

export default connect(mapStateToProps)(Home);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d5d7dae0',
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: 'white',
    borderRadius: 20,
    marginTop: -20,
    flexDirection: 'row',
  },
  title: {
    fontWeight: 'bold',
    color: 'black',
    paddingTop: 10,
    fontSize: 29,
    textAlign: 'center',
    marginBottom: 20,
    // fontFamily: 'Rubik-Black',
  },
  background: {
    height: 110,
  },
  search: {
    backgroundColor: 'white',
    width: 300,
    paddingHorizontal: 20,
    borderRadius: 20,
    // borderWidth: 2,
    // borderColor: 'black',
    marginLeft: 30,
    marginTop: 20,
  },
});
