import React, { Component } from "react";
import {
  Modal,
  Text,
  View,
  Alert,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
} from "react-native";
import { standardPostApi } from "../../api/ApiWrapper";
import Loader from "../../components/Loader";

export default class CountryModal extends Component {
  state = {
    modalVisible: true,
    fetchingCountries: true,
    countryList: [],
    searchTxt: "",
  };

  static navigationOptions = {
    mode: "modal",
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  componentDidMount() {
    this.fetchCountryCode();
  }

  goBack = (item) => {
    const { navigation } = this.props;
    navigation.goBack();
    navigation.state.params.refreshFunc &&
      navigation.state.params.refreshFunc(item);
  };

  fetchCountryCode = async () => {
    this.setState({ fetchingCountries: true });
    try {
      const res = await standardPostApi("getCountry", undefined, {}, true);
      if (res.data.status == 200) {
        let all_countries = res.data.result;
        this.setState({
          countryList: all_countries,
        });
      }
    } catch (error) {
      console.log(error);
    }
    this.setState({ fetchingCountries: false });
  };

  render() {
    const { fetchingCountries, searchTxt } = this.state;
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.modalVisible}
        onRequestClose={() => {
          this.props.navigation.goBack();
        }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          {fetchingCountries ? (
            <Loader />
          ) : (
            <View style={{ flex: 1 }}>
              <View style={styles.modalContainer}>
                <View style={styles.filterInputStyleContainer}>
                  <TextInput
                    autoFocus
                    placeholder="Search"
                    style={styles.filterInputStyle}
                    onChangeText={(text) => {
                      this.setState({ searchTxt: text });
                    }}
                  />
                  <Text style={styles.searchIconStyle}>🔍</Text>
                </View>
                <FlatList
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                  style={{ flex: 1 }}
                  data={this.state.countryList}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => {
                    if (searchTxt.trim().length > 0) {
                      if (searchTxt != null || searchTxt != "") {
                        const mainTerm = item.country;
                        const subTerm = searchTxt;
                        const searchRegex = new RegExp(subTerm, "i");
                        const res = mainTerm.match(searchRegex);
                        const isMatch = res != null && res.length > 0;
                        if (isMatch == false) return null;
                      }
                    }

                    return (
                      <TouchableOpacity onPress={() => this.goBack(item)}>
                        <View style={styles.countryModalStyle}>
                          <Image
                            style={styles.modalFlagStyle}
                            source={{ uri: item.country_flag_icon }}
                          />
                          <View style={styles.modalCountryItemContainer}>
                            <Text
                              style={styles.modalCountryItemCountryNameStyle}
                            >
                              {item.country}
                            </Text>
                            <Text
                              style={
                                styles.modalCountryItemCountryDialCodeStyle
                              }
                            >{`${item.country_code}`}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
              <TouchableOpacity
                onPress={() => this.goBack("")}
                style={styles.closeButtonStyle}
              >
                <Text style={styles.closeTextStyle}>CLOSE</Text>
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    paddingTop: 15,
    paddingLeft: 25,
    paddingRight: 25,
    flex: 1,
    backgroundColor: "white",
  },
  closeButtonStyle: {
    padding: 12,
    alignItems: "center",
  },
  closeTextStyle: {
    padding: 5,
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
  },
  filterInputStyleContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  filterInputStyle: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#fff",
    color: "#424242",
  },
  searchIcon: {
    padding: 10,
  },
  countryModalStyle: {
    flex: 1,
    borderColor: "black",
    borderTopWidth: 1,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalFlagStyle: {
    height: 20,
    width: 20,
    resizeMode: "contain",
  },
  modalCountryItemContainer: {
    flex: 1,
    paddingLeft: 5,
    flexDirection: "row",
  },
  modalCountryItemCountryNameStyle: {
    flex: 1,
    fontSize: 15,
  },
  modalCountryItemCountryDialCodeStyle: {
    fontSize: 15,
  },
});
