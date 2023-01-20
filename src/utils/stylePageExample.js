// Example of global styling sheet
// This is no longer being used anymore

import { useState } from "react";
import { NextSeo } from "next-seo";
import _ from "lodash";

import { gql } from "@apollo/client";
import { layoutQuery } from "@graphql/layoutQuery";
import apolloClient from "@services/apolloClient";

import {
  Modal,
  Layout,
  Input,
  Select,
  Option,
  ShareDrawer,
} from "@components/common";
import { useForm } from "react-hook-form";

export default function Style() {
  const [modalState, setModalState] = useState(false);
  const { register, handleSubmit } = useForm();

  const onSubmit = (data, event) => {
    event.preventDefault();
    alert(`${data.emailAddress} ${data.shirtSize}`);
  };

  return (
    <section>
      <NextSeo title="Style" />
      <div className="container">
        <div className="rowToCol gap md">
          <div className="column">
            <h1>This is an H1</h1>
            <h2>This is an H2</h2>
            <h3>This is an H3</h3>
            <h4>This is an H4</h4>
            <p>This is a paragraph</p>
          </div>
          <div className="column">
            <h1 className="light">This is an H1</h1>
            <h2 className="light">This is an H2</h2>
            <h3 className="light">This is an H3</h3>
            <h4 className="light">This is an H4</h4>
            <p>
              <a className="bold" href="/" alt="test">
                Subscribe
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="rowToCol gap lg">
          <div className="column">
            <h2>Solid Buttons</h2>
            <button onClick={() => setModalState(true)}>Contact Us</button>
            <button className="secondary" onClick={() => setModalState(true)}>
              Contact Us
            </button>
            <button className="gradient" onClick={() => setModalState(true)}>
              Contact Us
            </button>
          </div>
          <div className="column">
            <h2>Outline Buttons</h2>
            <button
              className="gradient-outline"
              onClick={() => setModalState(true)}
            >
              <div className="gradient-inner">Contact Us</div>
            </button>
            <button
              className="secondary-outline"
              onClick={() => setModalState(true)}
            >
              Contact Us
            </button>
            <button className="disabled" onClick={() => setModalState(true)}>
              Contact Us
            </button>
          </div>
          {modalState && (
            <Modal setShowModal={setModalState}>Modal Content Goes here</Modal>
          )}
        </div>
      </div>
      <div className="container">
        <h2>FORMS</h2>
        <form name="subscribe" onSubmit={handleSubmit(onSubmit)}>
          <div className="rowToCol gap md">
            <Input
              name="emailAddress"
              type="email"
              label="Subscribe to news updates"
              placeholder="Your email address"
              register={register}
            />
            <Select register={register} name="shirtSize" label="Shirt Size">
              <Option hidden disabled selected value="">
                Select An Option
              </Option>
              <Option value="Small" />
              <Option value="Medium" />
              <Option value="Large" />
            </Select>
          </div>
          <button type="submit">Subscribe</button>
        </form>
      </div>
      <div className="container">
        <h2>TABLE</h2>
        <div className="table-wrapper">
          <table className="default">
            <thead>
              <tr>
                <th>TABLE</th>
                <th>TABLE</th>
                <th>TABLE</th>
                <th>TABLE</th>
                <th>TABLE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>TABLE</td>
                <td>TABLE</td>
                <td>TABLE</td>
                <td>TABLE</td>
                <td>TABLE</td>
              </tr>
              <tr>
                <td>TABLE</td>
                <td />
                <td />
                <td />
                <td />
              </tr>
              <tr>
                <td>TABLE</td>
                <td>TABLE</td>
                <td>TABLE</td>
                <td>TABLE</td>
                <td>TABLE</td>
              </tr>
              <tr>
                <td>TABLE</td>
                <td />
                <td />
                <td />
                <td />
              </tr>
              <tr>
                <td>TABLE</td>
                <td>TABLE</td>
                <td>TABLE</td>
                <td>TABLE</td>
                <td>TABLE</td>
              </tr>
              <tr>
                <td>TABLE</td>
                <td />
                <td />
                <td />
                <td />
              </tr>
              <tr>
                <td>TABLE</td>
                <td>TABLE</td>
                <td>TABLE</td>
                <td>TABLE</td>
                <td>TABLE</td>
              </tr>
              <tr>
                <td>TABLE</td>
                <td />
                <td />
                <td />
                <td />
              </tr>
              <tr>
                <td>TABLE</td>
                <td>TABLE</td>
                <td>TABLE</td>
                <td>TABLE</td>
                <td>TABLE</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="container">
        <ShareDrawer />
      </div>
    </section>
  );
}

Style.Layout = Layout;

export const getAllData = gql`
  query indexPageQuery {
    ${layoutQuery}
  }
`;

export const getStaticProps = async () => {
  const { data } = await apolloClient.query({ query: getAllData });
  const navbarData = _.get(data, "navbarCollection.items[0]");
  const seoConfigData = _.get(data, "seoConfigCollection.items[0]");
  const footerData = _.get(data, "footerCollection.items[0]");

  return {
    props: { navbarData, seoConfigData, footerData },
    revalidate: 259200,
  };
};
