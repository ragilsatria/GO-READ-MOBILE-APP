import {APP_API_URL} from '@env';
import {Picker} from '@react-native-community/picker';
import React, {Component} from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Text as Heading, Button} from 'react-native-elements';
import {connect} from 'react-redux';
import {cover} from '../../assets';
import {Card, Loading} from '../../components';
import {getAuthor} from '../../redux/actions/author';
import {getBook} from '../../redux/actions/book';
import {getGenre} from '../../redux/actions/genre';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      book: this.props.book.value || 'Data not found',
      keyword: '',
      page: 1,
      sort: 'latest',
      loading: false,
      thisPage: 1,
      totalPage: 0,
    };
  }
  isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };
  fetchBook = async (search, sort, page) => {
    await this.props
      .dispatch(getBook(this.props.auth.data.token, search, sort, page))
      .then((res) => {
        this.setState({book: this.props.book.value});
      })
      .catch((err) => {
        if (err.response.status === 401) {
          this.props.navigation.replace('Login');
        }
      });
  };

  fetchAuthor = async () => {
    await this.props
      .dispatch(getAuthor(this.props.auth.data.token))
      .then((res) => {
        this.setState({book: this.props.book.value});
      })
      .catch((err) => {
        if (err.response.status === 401) {
          // this.props.navigation.replace('Login');
        }
      });
  };

  fetchGenre = async () => {
    await this.props
      .dispatch(getGenre(this.props.auth.data.token))
      .then((res) => {
        this.setState({book: this.props.book.value});
      })
      .catch((err) => {
        if (err.response.status === 401) {
          // this.props.navigation.replace('Login');
        }
      });
  };

  createPagination = async () => {
    let dataLength = this.props.book.count;
    let totalPage = Math.ceil(dataLength / 6);
    await this.setState({totalPage: totalPage});
  };

  LoadMore = async () => {
    await this.props
      .dispatch(
        getBook(
          this.props.auth.data.token,
          null,
          null,
          this.state.thisPage + 1,
        ),
      )
      .then((res) => {
        const data = res.value.data.data;
        data.map((a) => {
          return this.setState({
            book: [...this.state.book, a],
            thisPage: this.state.thisPage + 1,
          });
        });
      })
      .catch((err) => {
        if (err.response.status === 401) {
          this.props.navigation.replace('Login');
        }
      });
  };

  componentDidMount() {
    this.fetchBook();
    this.fetchGenre();
    this.fetchAuthor();
    this.createPagination();
  }

  handleSort = async (itemValue) => {
    await this.setState({sort: itemValue});
    this.fetchBook(this.state.keyword, this.state.sort).then(() => {
      this.setState({book: this.props.book.value});
    });
  };

  handleSearch = () => {
    this.fetchBook(this.state.keyword).then(() => {
      this.setState({book: this.props.book.value});
    });
  };
  render() {
    return (
      <>
        <View style={styles.container}>
          <ImageBackground source={cover} style={styles.background} />
          <View style={styles.content}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              onScroll={async ({nativeEvent}) => {
                if (this.isCloseToBottom(nativeEvent)) {
                  // await this.setState({loading: true}
                }
              }}
              scrollEventThrottle={200}>
              <Text style={styles.title}>Book List</Text>
              <View style={styles.sort}>
                <Text style={styles.sort_header}>Sort</Text>
                <Picker
                  mode="dropdown"
                  selectedValue={this.state.sort}
                  style={styles.sort_dropdown}
                  onValueChange={(itemValue, itemIndex) =>
                    this.handleSort(itemValue)
                  }>
                  <Picker.Item label="Latest" value="latest" />
                  <Picker.Item label="A-Z" value="title-asc" />
                  <Picker.Item label="Z-A" value="title-desc" />
                </Picker>
              </View>
              {this.state.book !== 'Data not found' ? (
                this.state.book ? (
                  this.state.book.map((data) => {
                    return (
                      <Card
                        key={data.id}
                        title={data.title}
                        description={data.description}
                        image={`${APP_API_URL}/images/${data.image}`}
                        onPress={async () => {
                          this.props.navigation.navigate('Detail', {
                            id: data.id,
                          });
                        }}
                      />
                    );
                  })
                ) : null
              ) : (
                <Heading h4 style={styles.notfound}>
                  Not Found
                </Heading>
              )}
              {this.state.loading && (
                <ActivityIndicator size="large" color="red" />
              )}
              {this.state.thisPage < this.state.totalPage && (
                <View style={styles.load}>
                  <Button title="Load More" onPress={() => this.LoadMore()} />
                </View>
              )}
            </ScrollView>
          </View>
        </View>
        {this.props.book.isLoading && <Loading />}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  author: state.author,
  book: state.book,
  ggenre: state.ggenre,
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
  },
  background: {
    height: 110,
  },
  search: {
    marginTop: 10,
    width: 300,
    marginLeft: 25,
    backgroundColor: 'transparent',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  search_input: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
  sort: {
    flexDirection: 'row',
    paddingLeft: 150,
  },
  sort_dropdown: {height: 50, width: 140, marginLeft: 30},
  sort_header: {marginTop: 15},
  notfound: {textAlign: 'center', color: 'red'},
  load: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
});
