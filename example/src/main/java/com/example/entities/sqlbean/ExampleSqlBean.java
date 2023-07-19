package com.example.entities.sqlbean;

import com.pkyingyu.mp.common.entities.sqlbean.BaseSqlBean;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;


@Entity
@Table(name = "example")
public class ExampleSqlBean extends BaseSqlBean {

    @Column(name = "my_name", nullable = false, unique = true, insertable = false, updatable = false, length = 50, precision = 10, scale = 2, columnDefinition = "varchar(255) default 'N/A'")
    private String myName;

    public String getMyName() {
        return myName;
    }

    public void setMyName(String myName) {
        this.myName = myName;
    }
}
