#include "mheads.h"
#include "lheads.h"
#include "oapp.h"

int app_exist_data_get(CGI *cgi, HASH *dbh, HASH *evth, session_t *ses)
{
	mdb_conn *conn = (mdb_conn*)hash_lookup(dbh, "main");
	mevent_t *evt = (mevent_t*)hash_lookup(evth, "aic");
	int ret;
	
	LPRE_DBOP(cgi->hdf, conn, evt);

	HDF *hdf = cgi->hdf;
	
	char *aname = hdf_get_value(hdf, PRE_QUERY".aname", NULL);
	if (!aname) {
		mtc_err("aname NULL");
		return RET_RBTOP_INPUTE;
	}

	hdf_set_int_value(evt->hdfsnd, "aid", (int)hash_string(aname));
	ret = mevent_trigger(evt);
	if (PROCESS_NOK(ret)) {
		mtc_err("get %s stat failure %d", aname, ret);
		return RET_RBTOP_EVTE;
	}

	if (hdf_get_obj(evt->hdfrcv, "state")) {
		hdf_set_value(hdf, PRE_OUTPUT".exist", "1");
	} else {
		hdf_set_value(hdf, PRE_OUTPUT".exist", "0");
	}
	
	return RET_RBTOP_OK;
}

int app_new_data_get(CGI *cgi, HASH *dbh, HASH *evth, session_t *ses)
{
	mdb_conn *conn = (mdb_conn*)hash_lookup(dbh, "main");
	mevent_t *evt = (mevent_t*)hash_lookup(evth, "aic");
	int ret;
	
	LPRE_DBOP(cgi->hdf, conn, evt);

	/* TODO */
	hdf_set_copy(cgi->hdf, PRE_OUTPUT".aname", PRE_QUERY".aname");
	
	return RET_RBTOP_OK;
}
