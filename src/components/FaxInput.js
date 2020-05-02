import React, { useState } from 'react'
import { Helmet } from 'react-helmet'

// Material-UI
import {
  Grid,
  Typography,
  Button,
  TextField,
} from '@material-ui/core/'
import { makeStyles } from '@material-ui/core/styles'
import Autocomplete from '@material-ui/lab/Autocomplete'

// Material-UI（DatePicker関連）
import DateFnsUtils from '@date-io/date-fns'
import ja from 'date-fns/locale/ja'
import {MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';

// React Spreadsheet
import Spreadsheet from 'react-spreadsheet'

// GraphQL
import gql from 'graphql-tag'

// Apollo-Client
import { useQuery } from 'react-apollo-hooks'

// スタイル
const useStyles = makeStyles((theme) => ({
  iframe: {
    width: '100%',
    height: '800px',
  },
}))

// マスタデータ取得クエリ
const GET_DATA = gql`
  query {
    urisaki2 {
      AIT_AITCD
      AIT_MEISJ
      AIT_SEISJ
    }
  }
`

// スプレッドのデータ
const detail = [
  [{value: '商品'}, {value: '単価'}, {value: '数量'}],
  [{value: '産地〆マダイ養殖'}, {value: 100}, {value: ''}],
  [{value: 'アトランティクサーモン養殖'}, {value: 200}, {value: ''}],
  [{value: '活アサリ'}, {value: 300}, {value: ''}],
  [{value: 'カンパチフィレ'}, {value: 400}, {value: ''}],
]
const FaxInput = () => {

  // スタイル・テーマ
  const classes = useStyles()

  // ステートフック
  const [nohinbi, setNohinbi] = useState(new Date())

  // 納品日変更時
  const doNohinbiChange = date => {
    if (date !== null) {
      if (date.toString() !== "Invalid Date") {
        setNohinbi(date)
      }
    }
  }

  // データ取得
  // fetchPolicy:
  // 'cache-and-network': 画面遷移が起こったタイミングで、キャッシュorネットワークからデータを取得して再表示する
  // 'cache-first': 常に最初にキャッシュからデータを読み取ろうとする
  const { loading, error, data } = useQuery(GET_DATA, {
    // fetchPolicy: 'cache-and-network',
    fetchPolicy: 'cache-first',
  })

  // 通信状態に応じたコンポーネントを表示
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div>
      <Helmet>
        <title>FAX見ながら登録</title>
      </Helmet>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4">FAX見ながら登録</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <iframe title="FaxPdf" src={`${process.env.PUBLIC_URL}/sample.pdf`} className={classes.iframe} />
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Autocomplete
                options={data.urisaki2}
                defaultValue={data.urisaki2[0]}
                getOptionLabel={(option) => option.AIT_AITCD + " - " + option.AIT_MEISJ}
                style={{ width: 400 }}
                renderInput={(params) =>
                  <TextField {...params} label="得意先" />
                }
              />
              <Typography variant="caption" display="block" gutterBottom>
                ※FAX受信元(電話番号等)より得意先を判別して自動選択<br />
                ※後から変更も可能？
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  margin="normal"
                  label="納品日"
                  format="yyyy-MM-dd"
                  locale={ja}
                  value={nohinbi}
                  onChange={doNohinbiChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </MuiPickersUtilsProvider>
              <Typography variant="caption" display="block" gutterBottom>
                ※左のFAX画像を見ながら手入力
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Spreadsheet data={detail} />
              <Typography variant="caption" display="block" gutterBottom>
                ※当該得意先について、過去（前回）に入力した商品と単価を一覧表示<br />
                ※商品の追加可能<br />
                ※左のFAX画像を見ながら、数量を手入力<br />
                ※単価は変更可能？
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary">登録して次のFAXを入力</Button>
              <Typography variant="caption" display="block" gutterBottom>
                ※ログイン中のユーザが担当していて、まだ発注書の入力が完了していないFAXがあれば、続けて入力可能
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default FaxInput