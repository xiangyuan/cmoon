#include <stdlib.h>		/* malloc() */
#include <stdint.h>		/* uint32_t and friends */
#include <stdbool.h>		/* bool */
#include <string.h>		/* memcpy() */
#include <arpa/inet.h>		/* htonl() and friends */

#include "fdb.h"
#include "ClearSilver.h"

int fdb_init(fdb_t **fdb, char *ip, char *name)
{
	return fdb_init_long(fdb, ip, DB_USER, DB_PASS, name);
}

int fdb_init_long(fdb_t **fdb, char *ip, char *user, char *pass, char *name)
{
	fdb_t *ldb;

	ldb = calloc(1, sizeof(fdb_t));
	if (ldb == NULL) {
		return RET_DBOP_INITE;
	}
	ldb->conn = mysql_init(NULL);
	if (ldb->conn == NULL) {
		return RET_DBOP_INITE;
	}
	*fdb = ldb;

	my_bool reconnect = 1;
	mysql_options(ldb->conn, MYSQL_OPT_RECONNECT, &reconnect);

	if (ip == NULL) ip = DB_IP;
	if (name == NULL) name = "home";
	
	ldb->conn = mysql_real_connect(ldb->conn, ip, user, pass, name, 0, NULL, 0);
	if (ldb->conn == NULL)
		return RET_DBOP_CONNECTE;
	return RET_DBOP_OK;
}

int fdb_exec(fdb_t *fdb)
{
	int ret;
	
	if (fdb->conn == NULL)
		return RET_DBOP_CONNECTE;
	if (fdb->res != NULL) {
		mysql_free_result(fdb->res);
		fdb->res = NULL;
	}
	ret = mysql_real_query(fdb->conn, fdb->sql, strlen(fdb->sql));
	if (ret != 0)
		return RET_DBOP_ERROR;
	return RET_DBOP_OK;
}
int fdb_fetch_row(fdb_t *fdb)
{
	if (fdb->conn == NULL)
		return RET_DBOP_CONNECTE;
	if (fdb->res == NULL) {
		fdb->res = mysql_store_result(fdb->conn);
		if (fdb->res == NULL)
			return RET_DBOP_ERROR;
	}
	fdb->row = mysql_fetch_row(fdb->res);
	if (fdb->row == NULL)
		return RET_DBOP_ERROR;
	return RET_DBOP_OK;
}
int fdb_affect_rows(fdb_t *fdb)
{
	if (fdb->conn == NULL)
		return RET_DBOP_CONNECTE;
	return (int)mysql_affected_rows(fdb->conn);
}
char* fdb_error(fdb_t *fdb)
{
	if (fdb == NULL) return "init error";
	if (fdb->conn == NULL)
		return "connect error";
	return (char*)mysql_error(fdb->conn);
}

void fdb_free(fdb_t **fdb)
{
	fdb_t *ldb = *fdb;
	
	if (ldb == NULL)
		return;
	if (ldb->res != NULL) {
		mysql_free_result(ldb->res);
		ldb->res = NULL;
	}
	if (ldb->conn != NULL) {
		mysql_close(ldb->conn);
		ldb->conn = NULL;
	}
	free(ldb);
	*fdb = NULL;
}

#if 0
static void get_errmsg(int ret, char *res)
{
	switch (ret) {
	case RET_DBOP_INITE:
		strcpy(res, "链接数据库错误");
		break;
	case RET_DBOP_HDFNINIT:
		strcpy(res, "输入数据错误");
		break;
	case RET_DBOP_INPUTE:
		strcpy(res, "输入参数错误");
		break;
	case RET_DBOP_DBNINIT:
		strcpy(res, "数据库未初始化");
		break;
	case RET_DBOP_DBINTRANS:
		strcpy(res, "数据库操作未提交");
		break;
	case RET_DBOP_SELECTE:
		strcpy(res, "数据库查询失败");
		break;
	case RET_DBOP_UPDATEE:
		strcpy(res, "数据库更新失败");
		break;
	case RET_DBOP_EXIST:
		strcpy(res, "资源不存在");
		break;
	case RET_DBOP_NEXIST:
		strcpy(res, "资源已存在");
		break;
	case RET_DBOP_MEMALLOCE:
		strcpy(res, "分配内存失败");
	default:
		strcpy(res, "数据库操作错误");
		break;
	}
}
#endif