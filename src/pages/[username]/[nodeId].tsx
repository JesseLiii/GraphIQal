import React, { useContext, useEffect, useState } from 'react';
import MainTabs from '../../components/organisms/Tabs/MainTabs';
import ViewContext, {
  ViewContextInterface,
  MainTabProps,
} from '../../components/context/ViewContext';
import { useRouter, withRouter } from 'next/router';
import useSWR from 'swr';
import { fetcher } from '../../backend/driver/fetcher';
import TextButton from '../../components/molecules/TextButton';
import Graph2 from '../../packages/graph/Graph';
import Link from 'next/link';
import SplitPaneWrapper from '../../packages/dnd-editor/Document';

const Home: React.FC = () => {
  const [windowVar, setWindow] = useState<any>();
  const [documentVar, setDocument] = useState<any>();
  useEffect(() => {
    setWindow(window);
    setDocument(document);
  });

  const router = useRouter();

  const { username, nodeId } = router.query;

  const [currNodeId, setCurrNodeId] = useState(nodeId as string);

  const { data, error, isLoading } = useSWR(
    nodeId ? `/api/${username}/${nodeId}/document` : null,
    fetcher
  );

  // useEffect(() => {
  //   if (nodeId) {
  //     fetch(`/api/${username}/${nodeId}/document`)
  //       .then((res) => res.json())
  //       .then((data) => {
  //         if (data) {
  //           let includedIDs: { [key: string]: boolean } = {};
  //           data.map((record: any, index: number) => {
  //             if (!includedIDs[record.g.properties.id]) {
  //               includedIDs[record.g.properties.id] = true;

  //               newTabs.push({
  //                 label: record.g.properties.title,
  //                 viewId: record.g.properties.id,
  //                 viewType: 'graph',
  //                 component: (
  //                   <Graph2
  //                     viewId={record.g.properties.id}
  //                     title={record.g.properties.title}
  //                   />
  //                 ),
  //               });
  //             }
  //           });
  //         }
  //       });
  //   }
  //   setTabs(newTabs);
  // }, []);

  useEffect(() => {
    setCurrNodeId(nodeId as string);
  }, [nodeId]);

  let newTabs: MainTabProps[] = [
    {
      label: 'Home',
      viewId: '',
      viewType: 'document',
      component: <SplitPaneWrapper viewId={''} />,
    },
  ];
  const [tabs, setTabs] = useState<MainTabProps[]>(newTabs);

  useEffect(() => {
    if (!data) return;
    if (!isLoading) {
      if (data) {
        let includedIDs: { [key: string]: boolean } = {};
        data.map((record: any, index: number) => {
          if (!includedIDs[record.g.properties.id]) {
            includedIDs[record.g.properties.id] = true;

            newTabs.push({
              label: record.g.properties.title,
              viewId: record.g.properties.id,
              viewType: 'graph',
              component: (
                <Graph2
                  viewId={record.g.properties.id}
                  title={record.g.properties.title}
                />
              ),
            });
          }
        });
      }
    }
    setTabs(newTabs);
  }, [data]);

  const [currTab, setCurrTab] = useState(0);

  useEffect(() => {
    setCurrTab(0);
  }, [nodeId]);

  if (tabs) {
    console.log('tabs ' + tabs.length);
  }

  return (
    <ViewContext.Provider
      value={{
        mainViewTabs: tabs,
        setMainViewTabs: setTabs,
        username: username as string,
        nodeId: currNodeId,
        setNodeId: setCurrNodeId,
        currTab: currTab,
        setCurrTab: setCurrTab,
        windowVar: windowVar,
        documentVar: documentVar,
      }}
    >
      <MainTabs />
    </ViewContext.Provider>
  );
};
export default withRouter(Home);
