package com.example.repository;

import com.example.entities.sqlbean.ExampleSqlBean;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IExampleDao  extends JpaRepository<ExampleSqlBean, String> {
}
