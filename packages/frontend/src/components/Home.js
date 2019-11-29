import React from "react";
import { Grid, Image, Statistic, Loader } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { useQuery } from "react-apollo";
import { utils } from "ethers";
import { convertWeiToDollars, getShareValue } from "../helpers/currency";
import gql from "graphql-tag";

import logo from "../assets/1pondo.png";

const GET_METADATA = gql`
  {
    poolValue @client
    exchangeRate @client
    totalShares @client
    guildBankValue @client
  }
`;

const Home = () => {
  const { loading, error, data } = useQuery(GET_METADATA);
  if (loading) return <Loader size="massive" active />;
  if (error) throw new Error(error);
  const { guildBankValue, exchangeRate, totalShares, poolValue } = data;

  const shareValue = getShareValue(totalShares, guildBankValue);
  console.log("metadata: ", data);

  return (
    <div id="homepage">
      <Grid container verticalAlign="middle" textAlign="center">
        <Grid.Row>
          <Image src={logo} id='main-logo'></Image>
        </Grid.Row>
        <Grid.Row>
          <Grid doubling stackable columns="equal" verticalAlign="bottom">
            <Grid.Column>
              <Grid.Row className="guild_value" textAlign="center">
                <Statistic inverted>
                  <Statistic.Label>Guild Bank Value</Statistic.Label>
                  <Statistic.Value>
                    {convertWeiToDollars(guildBankValue, exchangeRate)}
                  </Statistic.Value>
                </Statistic>
              </Grid.Row>
              {/* <Grid.Row className="pool_value" textAlign="center">
                <Statistic size="tiny" inverted>
                  <Statistic.Label>Pool Value</Statistic.Label>
                  <Statistic.Value>{convertWeiToDollars(poolValue, exchangeRate)}</Statistic.Value>
                </Statistic>
              </Grid.Row> */}
            </Grid.Column>
          </Grid>
        </Grid.Row>
        <Grid.Row className="mt-5">
          <Grid stackable columns={3}>
            <Grid.Column textAlign="center">
              <Statistic inverted label="Total Shares" size="tiny"
                value={totalShares}
              />
            </Grid.Column>
            <Grid.Column textAlign="center">
              <Statistic inverted label="Total ETH" size="tiny"
                value={parseFloat(utils.formatEther(guildBankValue)).toFixed(0)}
              />
            </Grid.Column>
            <Grid.Column textAlign="center">
              <Statistic inverted label="Share Value" size="tiny"
                value={convertWeiToDollars(shareValue, exchangeRate)}
              />
            </Grid.Column>
          </Grid>
        </Grid.Row>
        <Grid.Row textAlign="center mt-3">
          <a class="text_link" href="https://github.com/memedao/whitepaper/blob/master/%E4%B8%80%E6%9C%ACDAO%EF%BC%8C%E4%B8%80%E7%A7%8D%E7%82%B9%E5%AF%B9%E7%82%B9%E7%9A%84%E5%90%90%E6%A7%BD%E7%B3%BB%E7%BB%9F.pdf">
            Whitepaper / 白皮书
          </a>
        </Grid.Row>

      </Grid>
    </div>
  );
};

export default Home;
