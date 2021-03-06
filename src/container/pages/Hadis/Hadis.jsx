import React, { Component, Fragment } from "react";
import HadisCard from "../../../component/HadisCard/HadisCard";
import "./Hadis.css";
import "../../../assets/main.css";
import InfiniteScroll from "react-infinite-scroll-component";

class Hadis extends Component {
  state = {
    hadis: [],
    keyword: "...",
    limit: 5,
    base_url: "localhost",
    message: `Aplikasi ini masih ada pengembangan. Jika Arabic text masih berupa '???', mohon diabaikan.
    Terima kasih atas perhatiannya`,
  };

  goToHadith = () => {
    this.props.history.push("/hadis");
  };
  goToQuran = () => {
    this.props.history.push("/alquran");
  };
  goHome = () => {
    this.props.history.push("/");
  };

  componentDidMount() {
    if (
      !localStorage.getItem("name") ||
      !localStorage.getItem("profession") ||
      !localStorage.getItem("location")
    ) {
      window.location = "/login";
    }
  }

  handleSearch = () => {
    fetch(
      `http://${this.state.base_url}/dyer-app-api/api/hadis/cari.php?keyword=${this.state.keyword}&limit=${this.state.limit}`
    )
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          hadis: res,
        });
      });
  };

  handleChangeKeyword = (event) => {
    let newKeyword = { ...this.state.keyword };
    newKeyword = event.target.value;
    this.setState({
      keyword: newKeyword,
    });

    if (newKeyword) {
      this.handleSearch();
    }
  };

  handleChangeLimit = (event) => {
    let newLimit = event.target.value;
    if (newLimit > 0) {
      fetch(
        `http://${this.state.base_url}/dyer-app-api/api/hadis/cari.php?keyword=${this.state.keyword}&limit=${newLimit}`
      )
        .then((res) => res.json())
        .then((res) => {
          this.setState({
            hadis: res,
            limit: newLimit,
          });
        })
        .catch((err) => console.log(err));
    }
  };

  render() {
    return (
      <Fragment>
        <div className="hadis-wrapper">
          <div className="search-box">
            <input
              type="text"
              placeholder="Masukkan topik atau kata kunci lainnya"
              name="keyword"
              onChange={this.handleChangeKeyword}
              autoComplete="of"
              autoFocus
            />
            {/* <button className="search-button" >
              <i className="bi bi-search" />
            </button> */}
          </div>
          <div className="limit">
            <input
              type="number"
              placeholder="Batasi hasil pencarian (maks. 7008)"
              name="limit"
              onChange={this.handleChangeLimit}
            />
          </div>
          <div style={{ padding: "0px 15px" }}>{this.state.message}</div>
          <div className="content-hadith">
            {this.state.hadis.length > 0 ? (
              <h1>Hasil Pencarian ({`${this.state.hadis.length} hasil`})</h1>
            ) : (
              <h1>Silakan masukan kata kunci</h1>
            )}

            <div className="item-wrapper">
              <InfiniteScroll
                dataLength={this.state.hadis.length} //This is important field to render the next data
                hasMore={true}
                loadMore={0}
                loader={<h4>Loading...</h4>}
                endMessage={
                  <p style={{ textAlign: "center" }}>
                    <b>Yay! You have seen it all</b>
                  </p>
                }
              >
                {this.state.hadis.map((hadis) => {
                  return <HadisCard key={hadis.no} data={hadis} />;
                })}
              </InfiniteScroll>
            </div>
          </div>
        </div>

        {/* navigation */}
        <div className="navigation">
          <div className="item" onClick={this.goToHadith}>
            <span>
              <div className="icon">
                <i className="bi bi-journal-text" />
              </div>
              <p>Hadis</p>
            </span>
          </div>
          <div className="item" onClick={this.goHome}>
            <span>
              <div className="icon">
                <i className="bi bi-house" />
              </div>
              <p>Beranda</p>
            </span>
          </div>
          <div className="item" onClick={this.goToQuran}>
            <span>
              <div className="icon">
                <i className="bi bi-book" />
              </div>
              <p>Alquran</p>
            </span>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Hadis;
